import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DvdFormat } from '../model/dvd-format';
import { Film } from '../model/film';
import { Origine } from '../model/origine';
import { FilmService } from '../services/film.service';

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css']
})
export class FilmDetailComponent implements OnInit{
  @Input() film: Film;
  loading = false;
  buttonDisabled = false;
  errorOccured = false;
  private critiquePresseExist = true;
  private annees: number[];
  zonesList: number[];
  dvdFormats: DvdFormat[];
  Origine = Origine;
  readonly dvdOrigineEnum = Origine.DVD
  updated = false;
  constructor(private filmService: FilmService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    this.buttonDisabled = true;
    this.filmService.getFilm(this.route.snapshot.params['id']).subscribe(_film => {
      this.film = _film;
      console.log(this.film)
    }
      , (error) => {
        console.log('an error occured when fetching film with id : ' + this.route.snapshot.params['id']);
        this.loading = false;
      }
      , () => {
        this.checkIfCritiquePresseExist();
        this.loading = false;
        //console.log(this.film)
      });
    
    this.buttonDisabled = false;
    this.annees = this.filmService.getAnneesSelect();
    this.zonesList = this.getZonesList();
    this.dvdFormats = [DvdFormat.BLUERAY, DvdFormat.DVD];
  }
  getZonesList = () => {
    const zonesList = [];
    for (let i = 1; i < 4; i++) {
      zonesList.push(i);
    }
    return zonesList;
  }
  private checkIfCritiquePresseExist(){
    if (this.film.critiquePresse && this.film.critiquePresse.length > 0) {
      // console.log('ngOnInit this.film.critiquesPresse');
    } else {
      // console.log('ngOnInit !! this.film.critiquesPresse');
      this.critiquePresseExist = false;
    }
  }
  
  updateFilm() {
    /*
    if (this.film.dvd && isNaN(this.film.dvd.annee)) {
      // console.log('this.film.dvd.annee is nan');
      this.film.dvd.annee = 0;
    }
    if (this.film.dvd) {
      // console.log('this.film.dvd.annee is nan');
      this.film.dvd.annee = 0;
    }*/
    /*
    if (this.dateSortie) {
      // console.log('this.dateSortie', this.dateSortie);
      const day = this.dateSortie.day;
      const month = this.dateSortie.month - 1;
      const year = this.dateSortie.year;
      // const dvd = new Dvd(year, '1', 'edition', false, null, new Date(year, month, day), DvdFormat.DVD);
      // tslint:disable-next-line:max-line-length
      const dvd = { id: null, annee: year, zone: '2', edition: 'edition', ripped: false, dateRip: null, dateSortie: new Date(year, month, day), format: DvdFormat.DVD };
      this.film.dvd = dvd;
      // console.log('this.film.dvd.dateSortie', this.film.dvd.dateSortie);
    }
    if (this.dateInsertion) {
      const day = this.dateInsertion.day;
      const month = this.dateInsertion.month - 1;
      const year = this.dateInsertion.year;
      // tslint:disable-next-line:max-line-length
      this.film.dateInsertion = new Date(year, month, day);
      // console.log('this.film.dateInsertion', this.film.dateInsertion);
    }*/
    if(this.film.dvd && this.film.dvd.dateSortie){
      
      this.film.dvd.dateSortie = new Date(this.film.dvd.dateSortie)
      console.log(this.film.dvd.dateSortie);
      //new Date(this.film.dvd.dateSortie.getFullYear, this.film.dvd.dateSortie.getMonth, this.film.dvd.dateSortie.getDay)
    }
    if(this.film.dvd && this.film.dvd.ripped){
      this.film.dvd.dateRip = new Date();
    }
    this.updated = false;
    this.loading = true;
    this.buttonDisabled = true;
    return this.filmService.updateFilm(this.film).subscribe(f => {
      console.log('film with id : ' + f.id + ' updated');
      this.film = f;
    }
      , (error) => {
        this.errorOccured = true;
        this.loading = false;
        console.log(error);
      }
      , () => {
        this.loading = false;
        this.buttonDisabled = false;
        this.updated = true;
        this.checkIfCritiquePresseExist();
      });
      
     console.log(this.film);
  }
}
