import { DvdFormat } from "./dvd-format";

export interface Dvd {
    id: number;
    annee: number;
    zone: number;
    edition: string;
    ripped: boolean;
    dateRip: Date;
    dateSortie: Date;
    format: DvdFormat;
}
