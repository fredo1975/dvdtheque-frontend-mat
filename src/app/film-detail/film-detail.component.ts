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
  readonly enSalleOrigineEnum = Origine.EN_SALLE
  updated = false;
  initOrigine: Origine
  constructor(private filmService: FilmService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    this.buttonDisabled = true;
    this.filmService.getFilm(this.route.snapshot.params['id']).subscribe({
      next: (_film) => {
        this.film = _film;
        this.initOrigine = this.film.origine
      },
      error: (e) => {
        console.error('an error occured when fetching film with id : ' + this.route.snapshot.params['id']);
        this.loading = false;
      },
      complete: () => {
        this.checkIfCritiquePresseExist();
        this.loading = false;
      }
    })
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
  createDateVu(){
    if(this.film.vu){
      this.film.dateVue = new Date();
    }
  }
  createDateRip(){
    if(this.film.dvd && this.film.dvd.ripped){
      this.film.dvd.dateRip = new Date();
    }
  }
  updateFilm() {
    this.updated = false;
    this.loading = true;
    this.buttonDisabled = true;
    return this.filmService.updateFilm(this.film).subscribe({
      next: (f) => {
        this.film = f;
      },
      error: (e) => {
        this.errorOccured = true;
        this.loading = false;
        console.error(e);
      },
      complete: () => {
        this.loading = false;
        this.buttonDisabled = false;
        this.updated = true;
        this.checkIfCritiquePresseExist();
      }
    })
  }
}
