import {
    context,
    ContractPromiseBatch,
    logging,
    PersistentMap,
    PersistentUnorderedMap,
    storage,
    u128,
} from "near-sdk-as";

import {Collection, collections, Token, TokenId, tokens, Trait} from './model'
import {AccountDetails, AccountDetail} from "./user";


/**************************/
/* DATA TYPES AND STORAGE */
/**************************/

type TokenIdArray = u32[]
export type CollectionId = u32
export type CollectionIdArray = CollectionId[]
export type AccountId = string
type TokenPrice = u128;
type CollectionName = string
type Genre = string


const ethAddressToNear = new PersistentMap<AccountId, AccountId>('n');
const tokenToOwner = new PersistentUnorderedMap<TokenId, AccountId>('a')
const escrowAccess = new PersistentMap<AccountId, AccountId[]>('e')
const getTokensOfAccountId = new PersistentMap<AccountId, TokenIdArray>('g')
const tokenPrices = new PersistentMap<TokenId, TokenPrice>('s')
const salesByGenre = new PersistentMap<Genre, TokenId[]>('h')
const allowedMinters = new PersistentUnorderedMap<AccountId, boolean>('x')
const accountToCollection = new PersistentUnorderedMap<AccountId, CollectionIdArray>('c')
const TOTAL_SUPPLY = 't'
const TOTAL_COLLECTIONS = 'q'
const init = "i"
const CONTRACT_OWNER = "m"

@nearBindgen
class DTO {
    constructor(public token: Token,
                public id: TokenId) {
    }
}

@nearBindgen
class CollectionDTO {
    constructor(public id: CollectionId,
                public collection: Collection) {
    }
}

@nearBindgen
class SaleDTO {
    constructor(public token: Token, public id: TokenId, public price: TokenPrice) {
    }
}

type DTOArray = DTO[]
type RecentSale = SaleDTO

/******************/
/* ERROR MESSAGES */
/******************/

// These are exported for convenient unit testing
export const ERROR_NO_ESCROW_REGISTERED = 'Caller has no escrow registered'
export const ERROR_CALLER_ID_DOES_NOT_MATCH_EXPECTATION = 'Caller ID does not match expectation'
export const ERROR_MAXIMUM_TOKEN_LIMIT_REACHED = 'Maximum token limit reached'
export const ERROR_OWNER_ID_DOES_NOT_MATCH_EXPECTATION = 'Owner id does not match real token owner id'
export const ERROR_TOKEN_NOT_OWNED_BY_CALLER = 'Token is not owned by the caller. Please use transfer_from for this scenario'

/******************/
/* CHANGE METHODS */

/******************/


// init contract owner
export function launch(owner: string): void {
    const i = storage.getPrimitive<boolean>(init, false)
    if (!i) {
        storage.set(CONTRACT_OWNER, owner)
        storage.set(init, true)
        storage.set(TOTAL_SUPPLY, 0)
        const defaultCollection = new Collection("Nearfolio",
            "Nearfolio default NFT Collection.",
            "Nearfolio",
            "http://www.nearfolio.io",
            "http://www.nearfolio.io/logo.png",
            [])
        collections.set(0, defaultCollection)
    }
}

export function get_contract_owner(): string {
    return storage.getSome<string>(CONTRACT_OWNER)
}

export function add_minter(minter: string): void {
    assert(context.predecessor == get_contract_owner())
    allowedMinters.set(minter, true)
}

export function get_minter(accountId: string): boolean {

    return allowedMinters.getSome(accountId)
}

export function get_all_minters(): string[] {
    const allMinters = allowedMinters.keys();
    const result: string[] = []
    for (let i = 0; i < allMinters.length; i++) {
        const minter = allowedMinters.getSome(allMinters[i])
        if (minter === true) {
            result.push(allMinters[i])
        }
    }
    return result
}

export function link_ethereum_wallet(eth_address: AccountId): void {
    ethAddressToNear.set(context.predecessor, eth_address)
}

// Grant access to the given `accountId` for all tokens the caller has
export function grant_access(escrow_account_id: string): void {
    let escrows = escrowAccess.get(context.predecessor);
    if (escrows && escrows.length > 0) {
        const newIdx = escrows.length + 1;
        escrows[newIdx] = escrow_account_id;
        escrowAccess.set(context.predecessor, escrows)
    } else {
        escrows = new Array<string>();
        escrows[0] = escrow_account_id
        escrowAccess.set(context.predecessor, escrows)
    }
}

// Revoke access to the given `accountId` for all tokens the caller has
export function revoke_access(escrow_account_id: string): void {
    const escrows = escrowAccess.get(context.predecessor)
    assert(escrows, 'ACCOUNT HAS NO ESCROW ASSIGNED.')
    if (escrows && escrows.length > 0) {
        let idx = 0;
        const newEscrows = new Array<string>()
        for (let i = 0; i < escrows.length; i++) {
            if (escrows[i] !== escrow_account_id) {
                newEscrows[idx] = escrows[i]
                idx++
            }
        }
        escrowAccess.set(context.predecessor, newEscrows)
    }

}

// Transfer the given `token_id` to the given `new_owner_id`. Account `new_owner_id` becomes the new owner.
// Requirements:
// * The caller of the function (`predecessor`) should have access to the token.
export function transfer_from(owner_id: string, new_owner_id: string, token_id: TokenId): void {
    const predecessor = context.predecessor
    // fetch token owner and escrow; assert access
    const owner = tokenToOwner.getSome(token_id)
    assert(owner == owner_id, ERROR_OWNER_ID_DOES_NOT_MATCH_EXPECTATION)
    const escrow = escrowAccess.get(owner)
    assert(escrow, "ESCROW DOES NOT EXIST")
    if (!escrow) return;
    let escrowExist: string | null = null
    for (let i = 0; i < escrow.length; i++) {
        if (escrow[i] == predecessor) {
            escrowExist = escrow[i]
        }
    }
    assert([owner, escrowExist].includes(predecessor), ERROR_CALLER_ID_DOES_NOT_MATCH_EXPECTATION)
    // assign new owner to token
    move_token(owner_id, token_id, new_owner_id)
}


// Transfer the given `token_id` to the given `new_owner_id`. Account `new_owner_id` becomes the new owner.
// Requirements:
// * The caller of the function (`predecessor`) should be the owner of the token. Callers who have
// escrow access should use transfer_from.
export function transfer(new_owner_id: string, token_id: TokenId): void {
    const predecessor = context.predecessor
    // fetch token owner and escrow; assert access
    const owner = tokenToOwner.getSome(token_id)
    assert(owner == predecessor, ERROR_TOKEN_NOT_OWNED_BY_CALLER + ' token id:' + token_id.toString() + '' + owner)

    // transfer helper. just keep code shorter.
    move_token(predecessor, token_id, new_owner_id);
}


function move_token(predecessor: string, token_id: TokenId, new_owner_id: string): void {
    // get token balance of owner
    const fromTokens: TokenIdArray | null = getTokensOfAccountId.get(predecessor)
    if (!fromTokens || fromTokens.length == 0) {
        return
    } else {
        const newBalance = new Array<TokenId>();
        let oldBalIdx: u32 = 0;
        // exclude the token you want to transfer from owner TokenId[]
        for (let i = 0; i < fromTokens.length; i++) {
            if (fromTokens[i] !== token_id) {
                newBalance[oldBalIdx] = fromTokens[i]
                oldBalIdx++
            }
        }
        // save new array for old owner,
        getTokensOfAccountId.set(predecessor, newBalance)

        // create and push TokenId Array for new owner.
        let newOwnerWallet = getTokensOfAccountId.get(new_owner_id)
        if (newOwnerWallet && newOwnerWallet.length > 0) {
            newOwnerWallet.push(token_id)
            getTokensOfAccountId.set(new_owner_id, newOwnerWallet)
        } else {
            const freshWallet = new Array<TokenId>();
            freshWallet[0] = token_id;
            getTokensOfAccountId.set(new_owner_id, freshWallet)
        }
        tokenToOwner.delete(token_id)
        tokenToOwner.set(token_id, new_owner_id)
    }
}

/****************/
/* VIEW METHODS */
/****************/


// Returns `true` or `false` based on caller of the function (`predecessor`) having access to account_id's tokens
export function check_access(account_id: string): boolean {
    const caller = context.predecessor
    // throw error if someone tries to check if they have escrow access to their own account;
    // not part of the spec, but an edge case that deserves thoughtful handling
    assert(caller != account_id, ERROR_CALLER_ID_DOES_NOT_MATCH_EXPECTATION)
    assert(escrowAccess.contains(account_id), ERROR_NO_ESCROW_REGISTERED)

    // if we haven't set an escrow yet, then caller does not have access to account_id
    if (!escrowAccess.contains(account_id)) {
        return false
    }

    const escrow = escrowAccess.getSome(account_id)
    let canAccess: boolean = false;
    for (let i = 0; i < escrow.length; i++) {
        if (escrow[i] == caller) {
            canAccess = true
        }
    }
    return canAccess
}

function check_access_internally(account_id: string, caller: string): boolean {
    // throw error if someone tries to check if they have escrow access to their own account;
    // not part of the spec, but an edge case that deserves thoughtful handling
    assert(caller != account_id, ERROR_CALLER_ID_DOES_NOT_MATCH_EXPECTATION)
    assert(escrowAccess.contains(account_id), ERROR_NO_ESCROW_REGISTERED)

    // if we haven't set an escrow yet, then caller does not have access to account_id
    if (!escrowAccess.contains(account_id)) {
        return false
    }

    const escrow = escrowAccess.getSome(account_id)
    let canAccess: boolean = false;
    for (let i = 0; i < escrow.length; i++) {
        if (escrow[i] == caller) {
            canAccess = true
        }
    }
    return canAccess
}

// Get an individual owner by given `tokenId`
export function get_token_owner(token_id: TokenId): string | null {
    return tokenToOwner.getSome(token_id)
}

/********************/
/* NON-SPEC METHODS */

/********************/

function mint_token(
    name: string,
    description: string,
    image_url: string,
    background_color: string,
    genre: string,
    creator: AccountId,
    file: string,
    external_link: string,
    traits: Trait[],
    collection_id: CollectionId,
    on_sale: string,
    price: string
): void {
    let balance: TokenIdArray | null = getTokensOfAccountId.get(creator)
    if (!balance) {
        balance = new Array<TokenId>();
    }
    const currentID = storage.getPrimitive<u32>(TOTAL_SUPPLY, 0)
    const new_token: Token = new Token(
        name,
        description,
        image_url,
        background_color,
        genre,
        creator,
        file,
        external_link,
        traits,
        collection_id,
    );
    balance.push(currentID)
    tokens.set(currentID, new_token)
    tokenToOwner.set(currentID, creator)
    getTokensOfAccountId.set(creator, balance)
    if (on_sale == '1') {
        put_token_to_sale(currentID, price)
    }
    if (collection_id && collection_id > 0) {
        const targetCollection = collections.getSome(collection_id)
        if (targetCollection.owner == context.predecessor) {
            targetCollection.tokens.push(currentID)
            collections.set(collection_id, targetCollection)
            logging.log('COLLECTION ID' + collection_id.toString())
        }
    } else {
        const targetCollection = collections.getSome(0)
        targetCollection.tokens.push(currentID)
        collections.set(collection_id, targetCollection)
    }
    storage.set(TOTAL_SUPPLY, currentID + 1)
}


export function mint_payment(name: string,
                             description: string,
                             image_url: string,
                             background_color: string,
                             genre: string,
                             file: string, external_link: string,
                             traits: Trait[],
                             collection_id: CollectionId,
                             on_sale: string,
                             price: string): void {
    const contract_owner = storage.getPrimitive(CONTRACT_OWNER, 'seadox3.testnet')
    assert(allowedMinters.getSome(context.predecessor) === true, "YOU ARE NOT ALLOWED TO MINT.")
    ContractPromiseBatch.create(contract_owner).transfer(context.attachedDeposit)
    const creator = context.predecessor
    mint_token(name,
        description,
        image_url,
        background_color,
        genre,
        creator,
        file,
        external_link,
        traits,
        collection_id,
        on_sale,
        price)
}

export function batch_mint_payment(name: string,
                                   description: string,
                                   image_url: string,
                                   background_color: string,
                                   genre: string,
                                   file: string, external_link: string,
                                   traits: Trait[],
                                   collection_id: CollectionId,
                                   on_sale: string,
                                   price: string,
                                   amount: i32): void {
    const contract_owner = storage.getPrimitive<string>(CONTRACT_OWNER, 'seadox3.testnet')
    assert(allowedMinters.getSome(context.predecessor) === true, "YOU ARE NOT ALLOWED TO MINT.")
    ContractPromiseBatch.create(contract_owner).transfer(context.attachedDeposit)
    const new_token: Token = new Token(
        name,
        description,
        image_url,
        background_color,
        genre,
        context.predecessor,
        file,
        external_link,
        traits,
        collection_id,
    );
    let balance: TokenIdArray | null = getTokensOfAccountId.get(context.predecessor)
    if (!balance) {
        balance = new Array<TokenId>();
    }
    const targetCollection = collections.getSome(collection_id)
    assert(targetCollection.owner == context.predecessor, "YOU CANNOT MINT ON THIS COLLECTION")
    for (let i = 0; i < amount; i++) {
        const currentID = storage.getPrimitive<u32>(TOTAL_SUPPLY, 0)
        balance.push(currentID)
        tokens.set(currentID, new_token)
        tokenToOwner.set(currentID, context.predecessor)
        getTokensOfAccountId.set(context.predecessor, balance)
        if (on_sale == '1') {
            put_token_to_sale(currentID, price)
            const genreSales = salesByGenre.getSome(genre)
            genreSales.push(currentID);
        }
        if (collection_id && collection_id > 0) {
            targetCollection.tokens.push(currentID)
            collections.set(collection_id, targetCollection)
            logging.log('COLLECTION ID' + collection_id.toString())
        } else {
            const targetDefaultCollection = collections.getSome(0)
            targetDefaultCollection.tokens.push(currentID)
            collections.set(collection_id, targetDefaultCollection)
        }
        storage.set(TOTAL_SUPPLY, currentID + 1)
    }
}

export function get_token_details(id: u32): Token {
    return tokens.getSome(id)
}

export function get_tokens(accountId: string): DTOArray | null {
    const TokenIds = getTokensOfAccountId.get(accountId)
    assert(TokenIds && TokenIds.length > 0, "ACCOUNT HAS NO BALANCE")
    if (TokenIds) {
        const payload: DTOArray = new Array<DTO>(TokenIds.length);

        for (let i = 0; i < TokenIds.length; i++) {
            const parsed: TokenId = u32(TokenIds[i])
            payload[i] = new DTO(tokens.getSome(parsed), TokenIds[i])
        }
        return payload
    }
    return null
}

export function get_owned_token_ids(accountId: string): TokenId[] | null {
    const TokenIds = getTokensOfAccountId.get(accountId)
    assert(TokenIds && TokenIds.length > 0, "ACCOUNT HAS NO BALANCE")
    if (TokenIds) {
        const result = new Array<TokenId>(TokenIds.length);
        for (let i = 0; i < TokenIds.length; i++) {
            result[i] = TokenIds[i]
        }
        return result
    }
    return null
}

export function get_tokens_by_collection(collectionId: CollectionId): DTO[] {
    const collectionObj = collections.getSome(collectionId)
    if (collectionObj) {
        const result: DTO[] = new Array<DTO>(/* collectionObj.tokens.length*/)
        for (let i = 0; i < collectionObj.tokens.length; i++) {
            const token = collectionObj.tokens[i];
            if (token) {
                result[i] = new DTO(tokens.getSome(token), token)
            }
        }
        return result
    }
    return []
}

export function get_escrow_tokens(account_id: AccountId): DTOArray | null {
    if (check_access_internally(account_id, context.predecessor)) {
        return get_tokens(account_id)
    }
    return null
}


// TRADE FUNCTIONS.
export function put_token_to_sale(token_id: TokenId, price: string): void {
    assert(tokenToOwner.get(token_id) == context.predecessor, ERROR_OWNER_ID_DOES_NOT_MATCH_EXPECTATION);
    const tokenObj = tokens.getSome(token_id)
    let salesOnGenre = salesByGenre.get(tokenObj.genre)
    if (salesOnGenre && salesOnGenre.length > 0) {
        salesOnGenre.push(token_id)
    } else {
        salesOnGenre = new Array<TokenId>()
        salesOnGenre.push(token_id)
    }
    salesByGenre.set(tokenObj.genre, salesOnGenre)
    tokenPrices.set(token_id, u128.from(price))
}

export function cancel_sale(token_id: TokenId): void {
    assert(tokenToOwner.get(token_id) == context.predecessor);
    tokenPrices.delete(token_id);
    const token = tokens.getSome(token_id)
    let salesOnGenre = salesByGenre.getSome(token.genre)
    for (let i = 0; i < salesOnGenre.length; i++) {
        if (salesOnGenre[i] === token_id) {
            salesOnGenre.splice(i, 1)
            salesByGenre.set(token.genre, salesOnGenre)
            break
        }
    }
}

export function get_sales(account_id: AccountId): DTOArray | null {
    const userTokens = getTokensOfAccountId.get(account_id)
    if (userTokens && userTokens.length > 0) {
        const result: DTOArray = new Array<DTO>();
        let idx = 0;
        for (let i = 0; i < userTokens.length; i++) {
            const price = tokenPrices.get(userTokens[i])
            if (price) {
                result[idx] = new DTO(tokens.get(userTokens[i]) as Token, userTokens[i])
                idx++
            }
        }
        return result
    }
    return null
}

export function get_price(token_id: TokenId): TokenPrice | null {
    return tokenPrices.get(token_id)
}

export function get_recent_tokens(): DTOArray {
    const length = tokenToOwner.length;
    const result = new Array<DTO>();
    let idx = 0
    if (length > 20) {
        for (let i = length - 19; i < length; i++) {
            const token = tokens.get(i)
            if (token) {
                result[idx] = new DTO(token, i)
                idx++
            }
        }
    } else {
        for (let i = 0; i < length; i++) {
            const token = tokens.get(i)
            if (token) {
                result[idx] = new DTO(token, i)
                idx++
            }
        }
    }

    return result
}

export function get_tokens_by_page(perPage: u32, page: u32): DTOArray {
    let startIndex = tokens.length - (page * perPage) > 0 ? tokens.length - (page * perPage) : 0
    let endIndex = tokens.length - ((page * perPage) - perPage) > 0 ? tokens.length - ((page * perPage) - perPage) : tokens.length;
    const results = new Array<DTO>();
    let idx = 0;
    for (let i = endIndex; i > startIndex; i--) {
        const token = tokens.get(i)
        if (token) {
            results[idx] = new DTO(token, i)
            idx++
        } else {
            startIndex--
        }
    }
    return results
}

export function token_supply(): u32 {
    return tokens.length
}

export function buy(token_id: TokenId): void {
    const buyer = context.predecessor;
    const price: TokenPrice = tokenPrices.getSome(token_id);
    const owner = tokenToOwner.get(token_id, "")

    if (!price || !owner) {
        ContractPromiseBatch.create(buyer as string).transfer(context.attachedDeposit)
        assert(false, "BUYER OR PRICE IS NOT FOUND. REFUNDING")
        return
    }
    if (price > context.attachedDeposit) {
        ContractPromiseBatch.create(buyer as string).transfer(context.attachedDeposit)
        assert(false, "ASSET PRICE IS HIGHER THAN DEPOSIT. REFUNDING")
        return
    }
    logging.log('PRICE: ' + price.toString() as string + 'Deposit: ' + context.attachedDeposit.toString())
    ContractPromiseBatch.create(owner as string).transfer(context.attachedDeposit)
    move_token(owner as string, token_id, buyer)
    tokenPrices.delete(token_id)
}


// COLLECTION FUNCTIONS
export function create_collection(collection_name: CollectionName, description: string, image_url: string, external_url: string): void {
    const currentCollectionId = storage.getPrimitive<u32>(TOTAL_COLLECTIONS, 1)
    assert(allowedMinters.getSome(context.predecessor) === true, "YOU ARE NOT ALLOWED TO CREATE COLLECTIONS.")
    const newCollection = new Collection(collection_name, description, context.predecessor, external_url, image_url, [])
    const hasCollection = accountToCollection.get(context.predecessor)
    if (hasCollection) {
        hasCollection.push(currentCollectionId)
        accountToCollection.set(context.predecessor, hasCollection)
    } else {
        accountToCollection.set(context.predecessor, [currentCollectionId])
    }
    collections.set(currentCollectionId, newCollection)
    storage.set(TOTAL_COLLECTIONS, currentCollectionId + 1)
}

export function burn_collection(collection_id: CollectionId): void {
    const collection = collections.getSome(collection_id)
    assert(context.predecessor == collection.owner)
    collections.delete(collection_id)
    const collectionsByUser = accountToCollection.get(context.predecessor)
    if (collectionsByUser && collectionsByUser.length > 0) {
        let idx: i32 = -1;
        for (let i = 0; i < collectionsByUser.length; i++) {
            if (collectionsByUser[i] == collection_id) {
                idx = i as u32
            }
        }
        if (idx < 0) return;
        collectionsByUser.splice(idx, 1)
        accountToCollection.set(context.predecessor, collectionsByUser)
    }
}


export function get_collections_by_account_id(account_id: AccountId): CollectionDTO[] {
    const collectionIds: CollectionIdArray = accountToCollection.getSome(account_id)
    const result: CollectionDTO[] = new Array<CollectionDTO>(collectionIds.length)
    for (let i = 0; i < collectionIds.length; i++) {
        const coll = collections.getSome(collectionIds[i])
        coll.tokens = []
        result[i] = new CollectionDTO(collectionIds[i], coll)
    }
    return result;
}

export function get_collection_by_id(collection_id: CollectionId): Collection {
    return collections.getSome(collection_id)
}

export function get_collections(perPage: u32, page: u32): CollectionDTO[] {
    let startIndex = collections.length - (page * perPage) > 0 ? collections.length - (page * perPage) : 0
    // 4
    let endIndex = collections.length - ((page * perPage) - perPage) > 0 ? collections.length - ((page * perPage) - perPage) : collections.length
    // 12
    const results = new Array<CollectionDTO>();
    let idx: u32 = 0;
    for (let i = endIndex; i >= startIndex; i--) {
        const coll = collections.get(i)
        if (coll) {
            results[idx] = new CollectionDTO(i, coll)
            idx++
        }
    }
    return results
}

export function total_collections(): u32 {
    return collections.length
}


// AccountDetails Functions


export function update_account_details(pp: string, website: string, description: string, instagram: string, twitter: string): void {
    assert(context.attachedDeposit > u128.from("0.1"), "STORAGE IS NOT PAID")
    assert(description.length <= 60)
    assert(website.length <= 30)
    assert(twitter.length <= 25)
    assert(instagram.length <= 25)
    const user = context.predecessor
    const newDetails = new AccountDetail(pp, website, description, twitter, instagram)
    AccountDetails.set(user, newDetails)
}

export function get_account_details(accountId: AccountId): AccountDetail {
    return AccountDetails.getSome(accountId)
}

export function get_user_profile_picture(accountId: AccountId): string {
    const user = AccountDetails.getSome(accountId)
    return user.pp
}
