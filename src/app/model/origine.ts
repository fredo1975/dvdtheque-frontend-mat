export enum Origine {
    DVD = 'DVD', 
    EN_SALLE = 'EN_SALLE', 
    TV = 'TV', 
    GOOGLE_PLAY = 'GOOGLE_PLAY',
    CANAL_PLUS = 'CANAL_PLUS',
    NETFLIX = 'NETFLIX',
    AMAZON_PRIME = 'AMAZON_PRIME',
    TOUS = 'TOUS'
}

function removeTousEntry() {
    return Object.values(Origine).filter(origine => origine !== Origine.TOUS);
    }
export const OriginesWithoutTous: Origine[] = removeTousEntry();