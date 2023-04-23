import { CritiquePresse } from "./critique-presse";
import { Dvd } from "./dvd";
import { Genre } from "./genre";
import { Origine } from "./origine";
import { Personne } from "./personne";

export interface Film {
    id: number,
    titre: string,
    titreO: string,
    annee: number,
    dateSortie: Date,
    dateInsertion: Date,
    dateSortieDvd: Date,
    vu: boolean,
    realisateur: Personne[],
    acteur: Personne[],
    critiquePresse: CritiquePresse[],
    genre: Genre[],
    dvd: Dvd,
    posterPath: string,
    alreadyInDvdtheque: boolean,
    tmdbId: number,
    overview: string,
    runtime: number,
    homepage: string,
    origine: Origine,
    dateMaj: Date,
    dateVue: Date,
    allocineFicheFilmId: number
}
