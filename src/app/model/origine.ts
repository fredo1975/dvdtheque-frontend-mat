export enum Origine {
    DVD = 'DVD', 
    EN_SALLE = 'EN_SALLE', 
    TV = 'TV', 
    GOOGLE_PLAY = 'GOOGLE_PLAY',
    CANAL_PLUS = 'CANAL_PLUS',
    NETFLIX = 'NETFLIX',
    AMAZON_PRIME = 'AMAZON_PRIME',
    DISNEY_PLUS = 'DISNEY_PLUS',
    ARTE = 'ARTE',
    TOUS = 'TOUS'
}
export const OrigineLabel: Record<Origine, string> = {
  DVD: 'Dvd',
  EN_SALLE: 'En salle',
  TV: 'TV',
  GOOGLE_PLAY: 'Google Play',
  CANAL_PLUS: 'Canal+',
  NETFLIX: 'Netflix',
  AMAZON_PRIME: 'Amazon Prime',
  DISNEY_PLUS: 'Disney+',
  ARTE: 'Arte',
  TOUS: 'Tous'
};
export const OriginesWithoutTous: Origine[] = Object.values(Origine)
    .filter((o): o is Exclude<Origine, Origine.TOUS> => o !== Origine.TOUS);
