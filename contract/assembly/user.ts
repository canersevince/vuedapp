import {PersistentUnorderedMap} from "near-sdk-as";
import {AccountId} from "./index";


@nearBindgen
export class AccountDetail {
    constructor(public pp: string, public website: string, public description: string, public twitter: string, public instagram: string) {
    }
}

export const AccountDetails = new PersistentUnorderedMap<AccountId, AccountDetail>('p')
