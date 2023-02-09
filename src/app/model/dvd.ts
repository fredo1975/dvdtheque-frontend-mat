import { DvdFormat } from "./dvd-format";

export class Dvd {
    id: number;
    annee: number;
    zone: string;
    edition: string;
    ripped: boolean;
    dateRip: Date;
    dateSortie: Date;
    format: DvdFormat;

    constructor(id: number,
        annee: number,
        zone: string,
        edition: string,
        ripped: boolean,
        dateRip: Date,
        dateSortie: Date,
        format: DvdFormat) {
            this.id = id;
            this.annee = annee;
            this.zone = zone;
            this.edition = edition;
            this.ripped = ripped;
            this.dateRip = dateRip;
            this.dateSortie = dateSortie;
            this.format = format;
    }
    public static fromJson(json: Dvd): Dvd {
        return new Dvd(
            json['id'],
            json['annee'],
            json['zone'],
            json['edition'],
            json['ripped'],
            json['dateRip'],
            json['dateSortie'],
            json['format']);
    }
}
