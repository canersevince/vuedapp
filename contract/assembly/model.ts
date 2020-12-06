import {PersistentUnorderedMap} from "near-sdk-as";
import {CollectionId} from "./index";


export type TokenId = u32;
export type Trait = TraitClass


@nearBindgen
export class TraitClass {
    constructor(public key: string,
                public value: string) {
    }
}


@nearBindgen
export class Token {
    constructor(public name: string,
                public description: string,
                public image_url: string,
                public background_color: string,
                public genre: string,
                public creator: string,
                public file: string,
                public external_link: string,
                public traits: Trait[],
                public collection_id: CollectionId,
    ) {
    }
}

@nearBindgen
export class Collection {
    constructor(public name: string,
                public description: string,
                public owner: string,
                public external_link: string,
                public image_url: string,
                public tokens: TokenId[]) {
    }
}


export const tokens = new PersistentUnorderedMap<TokenId, Token>('z')

export const collections = new PersistentUnorderedMap<CollectionId, Collection>('o')

