import {PersistentUnorderedMap, PersistentVector} from "near-sdk-as";


export type TokenId = u32;

@nearBindgen
export class Token {
    constructor(public name: string,
                public image: string,
                public description: string) {
    }
}

export const tokens = new PersistentUnorderedMap<TokenId, Token>('z')
