import {
    context,
    ContractPromiseBatch,
    PersistentMap,
    PersistentUnorderedMap,
    storage,
    u128,
    logging
} from "near-sdk-as";

import {Token, TokenId, tokens} from './model'


/**************************/
/* DATA TYPES AND STORAGE */
/**************************/

type TokenIdArray = u32[]
export type AccountId = string
type TokenPrice = u128;
// Note that MAX_SUPPLY is implemented here as a simple constant
// It is exported only to facilitate unit testing
// The strings used to index variables in storage can be any string
// Let's set them to single characters to save storage space
const tokenToOwner = new PersistentUnorderedMap<TokenId, AccountId>('a')
const escrowAccess = new PersistentMap<AccountId, AccountId[]>('e')
const getTokensOfAccountId = new PersistentMap<AccountId, TokenIdArray>('g')
const sales = new PersistentMap<TokenId, TokenPrice>('s')
// This is a key in storage used to track the current minted supply
const TOTAL_SUPPLY = 't'
const init = "i"
const CONTRACT_OWNER = "m"


@nearBindgen
class DTO {
    constructor(public token: Token,
                public id: TokenId) {
    }
}

type DTOArray = DTO[]

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
export function launch(): void {
    const i = storage.getPrimitive<boolean>(init, false)
    if (!i) {
        storage.set(CONTRACT_OWNER, 'seadox3.testnet')
        storage.set(init, true)
        storage.set(TOTAL_SUPPLY, 0)
    }
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
    image: string,
    owner: string): void {
    let balance: TokenIdArray | null = getTokensOfAccountId.get(owner)
    if (!balance) {
        balance = new Array<TokenId>();
    }
    const currentID = storage.getPrimitive<u32>(TOTAL_SUPPLY, 0)
    const new_token = new Token(name, image, description);
    balance.push(currentID)
    tokens.set(currentID, new_token)
    tokenToOwner.set(currentID, owner)
    getTokensOfAccountId.set(owner, balance)
    storage.set(TOTAL_SUPPLY, currentID + 1)
}

export function batch_mint(
    name: string,
    description: string,
    image: string,
    amount: i32,
    owner: string): void {
}

export function mint_payment(name: string, description: string, image: string): void {
    const contract_owner = storage.getPrimitive(CONTRACT_OWNER, 'seadox3.testnet')
    ContractPromiseBatch.create(contract_owner).transfer(context.attachedDeposit)
    const owner = context.predecessor
    mint_token(name, description, image, owner)
}

export function batch_mint_payment(name: string, description: string, image: string, amount: i32): void {
    const contract_owner = storage.getPrimitive(CONTRACT_OWNER, 'seadox3.testnet')
    ContractPromiseBatch.create(contract_owner).transfer(context.attachedDeposit)
    const owner = context.predecessor
    batch_mint(name, description, image, amount, owner)
}

export function get_token_details(id: i32): void {

}

export function get_tokens(accountId: string): DTOArray | null {
    const TokenIds = getTokensOfAccountId.get(accountId)
    assert(TokenIds && TokenIds.length > 0, "ACCOUNT HAS NO BALANCE")
    if (TokenIds) {
        /* const result = new Array<Token>(TokenIds.length);
         for (let i = 0; i < TokenIds.length; i++) {
             const parsed: TokenId = i32(TokenIds[i])
             result[i] = tokens.getSome(parsed)
         }*/
        const payload: DTOArray = new Array<DTO>(TokenIds.length);

        for (let i = 0; i < TokenIds.length; i++) {
            const parsed: TokenId = i32(TokenIds[i])
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

export function get_escrow_tokens(account_id: AccountId): DTOArray | null {
    if (check_access_internally(account_id, context.predecessor)) {
        return get_tokens(account_id)
    }
    return null
}


// TRADE FUNCTIONS.
export function put_token_to_sale(token_id: TokenId, price: string): void {
    assert(tokenToOwner.get(token_id) == context.predecessor, ERROR_OWNER_ID_DOES_NOT_MATCH_EXPECTATION);
    sales.set(token_id, u128.from(price))
}

export function cancel_sale(token_id: TokenId, price: TokenPrice): void {
    assert(tokenToOwner.get(token_id) == context.predecessor);
    sales.delete(token_id);
}

export function get_sales(account_id: AccountId): DTOArray | null {
    const userTokens = getTokensOfAccountId.get(account_id)
    if (userTokens && userTokens.length > 0) {
        const result: DTOArray = new Array<DTO>();
        let idx = 0;
        for (let i = 0; i < userTokens.length; i++) {
            const price = sales.get(userTokens[i])
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
    return sales.get(token_id)
}

export function buy(token_id: TokenId): void {
    const buyer = context.predecessor;
    const price: TokenPrice = sales.getSome(token_id);
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
    sales.delete(token_id)
}
