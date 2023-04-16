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
        // init of dvd in case change to dvd origine and to be able to set dateSortie of DVD
        if (!this.film.dvd) {
          this.film.dvd = { id: 0, annee: 0, zone: 2, edition: '', ripped: false, dateRip: new Date(), dateSortie: new Date(), format: DvdFormat.DVD }
        }
        this.initOrigine = this.film.origine
      },
      error: (e) => {
        console.log('an error occured when fetching film with id : ' + this.route.snapshot.params['id']);
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
    return this.filmService.updateFilm(this.film).subscribe({
      next: (f) => {
        console.log('film with id : ' + f.id + ' updated');
        this.film = f;
      },
      error: (e) => {
        this.errorOccured = true;
        this.loading = false;
        console.log(e);
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
