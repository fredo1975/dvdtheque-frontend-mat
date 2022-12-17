import { Film } from "./film";
import { Genre } from "./genre";
import { Personne } from "./personne";

export interface FilmListParam {
    realisateurs: Personne[];
    acteurs: Personne[];
    films: Film[];
    genres: Genre[];
    realisateursLength: number;
    acteursLength: number;
}
