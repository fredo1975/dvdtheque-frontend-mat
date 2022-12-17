import { CritiquePresse } from "./critique-presse";
import { Dvd } from "./dvd";
import { Genre } from "./genre";
import { Origine } from "./origine";
import { Personne } from "./personne";

export class Film {
    constructor(public id: number,
        public titre: string,
        public titreO: string,
        public annee: number,
        public dateSortie: Date,
        public dateInsertion: Date,
        public vu: boolean,
        public realisateur: Personne[],
        public acteur: Personne[],
        public critiquePresse: CritiquePresse[],
        public genre: Genre[],
        public dvd: Dvd,
        public posterPath: string,
        public alreadyInDvdtheque: boolean,
        public tmdbId: number,
        public overview: string,
        public runtime: number,
        public homepage: string,
        public origine: Origine,
        public dateMaj: Date,
        public dateVue: Date,
        public allocineFicheFilmId: number) {
    }
}
