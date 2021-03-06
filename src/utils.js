import {connect, Contract, keyStores, WalletConnection} from 'near-api-js'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initialize contract & set global variables
export async function initContract() {
    // Initialize connection to the NEAR testnet
    const near = await connect(Object.assign({deps: {keyStore: new keyStores.BrowserLocalStorageKeyStore()}}, nearConfig))

    // Initializing Wallet based Account. It can work with NEAR testnet wallet that
    // is hosted at https://wallet.testnet.near.org
    window.walletConnection = new WalletConnection(near)

    // Getting the Account ID. If still unauthorized, it's just empty string
    window.accountId = window.walletConnection.getAccountId()

    // Initializing our contract APIs by contract name and configuration
    window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
        // View methods are read only. They don't modify the state, but usually return some value.
        viewMethods: [
            "get_token_owner",
            "get_tokens",
            "get_tokens_by_collection",
            "get_recent_tokens",
            "get_owned_token_ids",
            "get_token_details",
            "tokens_of_paginated",
            "token_supply",
            "get_tokens_by_page",
            "get_price",
            "get_sales",
            "get_sales_by_genre",
            "get_contract_owner",
            "get_collections",
            "get_collection_by_id",
            "get_collections_by_account_id",
            "total_collections",
            "get_all_minters",
            "get_minter",
            "get_account_details",
            "get_user_profile_picture",
            "get_fee",
            "get_bids"
        ],
        // Change methods can modify the state. But you don't receive the returned value when called.
        changeMethods: [
            "mint_payment", "batch_mint_payment", "mint_token",
            "batch_mint", "launch", "get_escrow_tokens", "grant_access",
            "revoke_access", "transfer_from", "transfer", "clear", "check_access",
            "put_token_to_sale", "cancel_sale", "buy",
            "create_collection",
            "burn_collection",
            "add_minter",
            "update_account_details",
            "set_fee",
            "bid",
            "accept_bid",
            "remove_bid"
        ],
    })
}

export function logout() {
    window.walletConnection.signOut()
    // reload page
    window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
    // Allow the current app to make calls to the specified contract on the
    // user's behalf.
    // This works by creating a new access key for the user's account and storing
    // the private key in localStorage.
    window.walletConnection.requestSignIn(nearConfig.contractName)
}

