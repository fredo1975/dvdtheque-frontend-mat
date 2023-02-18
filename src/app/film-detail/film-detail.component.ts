import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dvd } from '../model/dvd';
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
  zonesList: number[] = [1,2,3];
  dvdFormats: DvdFormat[] = [DvdFormat.BLUERAY, DvdFormat.DVD];
  origines: Origine[] = [Origine.DVD,Origine.EN_SALLE,Origine.GOOGLE_PLAY,Origine.TV];
  Origine = Origine;
  readonly dvdOrigineEnum = Origine.DVD
  updated = false;
  initOrigine: Origine
  constructor(private filmService: FilmService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    this.buttonDisabled = true;
    this.filmService.getFilm(this.route.snapshot.params['id']).subscribe(_film => {
      this.film = _film;
      // init of dvd in case change to dvd origine
      if(!this.film.dvd){
        this.film.dvd = {id:0,annee:0,zone: 2,edition: '',ripped: false,dateRip: new Date(),dateSortie: new Date(),format: DvdFormat.DVD}
      }
      
      this.initOrigine = this.film.origine
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
    if(this.film.dvd && this.film.dvd.ripped){
      this.film.dvd.dateRip = new Date();
    }
    if(this.film.vu){
      this.film.dateVue = new Date();
    }
    this.updated = false;
    this.loading = true;
    this.buttonDisabled = true;
    if(this.initOrigine != this.film.origine && this.initOrigine == Origine.DVD){
      console.log('changement dorigine');
    }
    return this.filmService.updateFilm(this.film).subscribe(f => {
      //console.log('film with id : ' + f.id + ' updated');
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
  }
/*
  buildFilmWithDvd(film: Film): Film {
    let dateSortieDvd: any = null;
    // console.log('this.film.dvd', JSON.stringify(this.film.dvd));
    if (this.film.dvd && this.film.dvd.dateSortie) {
      dateSortieDvd = this.film.dvd.dateSortie;
    } else {
      dateSortieDvd = null;
    }
    // tslint:disable-next-line:max-line-length
    const dvd: Dvd = { id: null, annee: this.film.annee, zone: '2', edition: '', ripped: false, dateRip: null, dateSortie: dateSortieDvd, format: DvdFormat.DVD }
    // console.log('buildFilmWithDvd', JSON.stringify(dvd));
    // tslint:disable-next-line:max-line-length
    return new Film(film.id, film.titre, film.titreO, film.annee, film.dateSortie, new Date(), film.vu, film.realisateur, film.acteur, film.critiquePresse, film.genre,
      // tslint:disable-next-line:max-line-length
      dvd, film.posterPath, film.alreadyInDvdtheque, film.tmdbId, film.overview, film.runtime, film.homepage, Origine.DVD, film.dateMaj, film.dateVue,film.allocineFicheFilmId);
  }

  transformFilmEnSalleIntoDvd() {
    this.loading = true;
    this.buttonDisabled = true;
    this.errorOccured = false;
    const film: Film = this.buildFilmWithDvd(this.film);
    // console.log('transformFilmEnSalleIntoDvd', film);
    return this.filmService.updateFilm(film).subscribe(f => {
      this.film = f;
    }
      , (error) => {
        this.errorOccured = true;
        console.log(error);
      }
      , () => {
        this.loading = false;
        this.buttonDisabled = false;
        this.updated = true;
      });
  }

  buildFilmWithGooglePlay(film: Film): Film {
    let dateSortieDvd: any = null;
    // console.log('this.film.dvd', JSON.stringify(this.film.dvd));
    if (this.film.dvd && this.film.dvd.dateSortie) {
      dateSortieDvd = this.film.dvd.dateSortie;
    } else {
      dateSortieDvd = null;
    }
    // console.log('buildFilmWithGooglePlay', JSON.stringify(dvd));
    // tslint:disable-next-line:max-line-length
    return new Film(film.id, film.titre, film.titreO, film.annee, film.dateSortie, new Date(), film.vu, film.realisateur, film.acteur, film.critiquePresse, film.genre,
      // tslint:disable-next-line:max-line-length
      null, film.posterPath, film.alreadyInDvdtheque, film.tmdbId, film.overview, film.runtime, film.homepage, Origine.GOOGLE_PLAY, film.dateMaj, film.dateVue,film.allocineFicheFilmId);
  }
  transformFilmEnSalleIntoGooglePlay() {
    this.loading = true;
    this.buttonDisabled = true;
    this.errorOccured = false;
    const film: Film = this.buildFilmWithGooglePlay(this.film);
    // console.log('transformFilmEnSalleIntoDvd', film);
    return this.filmService.updateFilm(film).subscribe(f => {
      this.film = f;
    }
      , (error) => {
        this.errorOccured = true;
        console.log(error);
      }
      , () => {
        this.loading = false;
        this.buttonDisabled = false;
        this.updated = true;
      });
  }*/
}
