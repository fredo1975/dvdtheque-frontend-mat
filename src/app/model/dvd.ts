export class Dvd {
    id: number;
    annee: number;
    zone: string;
    edition: string;
    ripped: boolean;
    dateRip: Date;
    dateSortie: Date;
    format: DvdFormat;

    constructor(annee: number,
        zone: string,
        edition: string,
        ripped: boolean,
        dateRip: Date,
        dateSortie: Date,
        format: DvdFormat) {
    }
    public static fromJson(json: Object): Dvd {
        return new Dvd(
            json['annee'],
            json['zone'],
            json['edition'],
            json['ripped'],
            json['dateRip'],
            json['dateSortie'],
            json['format']);
    }
}
