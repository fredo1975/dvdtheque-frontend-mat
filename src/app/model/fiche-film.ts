import { CritiquePresse } from "./critique-presse";

export interface FicheFilm {
    id: number;
    allocineFilmId: number;
    url: string;
    pageNumber: number;
    title: string;
    critiquePresse: CritiquePresse[];
}
