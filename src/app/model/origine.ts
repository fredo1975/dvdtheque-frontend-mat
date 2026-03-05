export enum Origine {
    DVD = 'DVD', 
    EN_SALLE = 'EN_SALLE', 
    TV = 'TV', 
    GOOGLE_PLAY = 'GOOGLE_PLAY',
    CANAL_PLUS = 'CANAL_PLUS',
    NETFLIX = 'NETFLIX',
    AMAZON_PRIME = 'AMAZON_PRIME',
    DISNEY_PLUS = 'DISNEY_PLUS',
    TOUS = 'TOUS'
}
export const OriginesWithoutTous: Origine[] = Object.values(Origine)
    .filter((o): o is Exclude<Origine, Origine.TOUS> => o !== Origine.TOUS);
