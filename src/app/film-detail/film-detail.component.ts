import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dvd } from '../model/dvd';
import { DvdFormat } from '../model/dvd-format';
import { Film } from '../model/film';
import { Origine, OriginesWithoutTous } from '../model/origine';
import { FilmService } from '../services/film.service';
import { FilmStore } from '../store/film.store';
import { RealisateursPipe } from '../pipes/realisateurs.pipe';
import { GenresPipe } from '../pipes/genres.pipe';
import { MatDivider } from '@angular/material/divider';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf, NgFor, UpperCasePipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-film-detail',
    templateUrl: './film-detail.component.html',
    styleUrls: ['./film-detail.component.css'],
    standalone: true,
    imports: [NgIf, MatProgressSpinner, MatButton, MatIcon, NgFor, MatFormField, MatLabel, MatSelect, ReactiveFormsModule, FormsModule, MatOption, MatCheckbox, MatInput, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker, MatDivider, UpperCasePipe, DatePipe, GenresPipe, RealisateursPipe]
})
export class FilmDetailComponent implements OnInit{
  private store = inject(FilmStore);
  @Input() film: Film;
  loading = false;
  buttonDisabled = false;
  errorOccured = false;
  private critiquePresseExist = true;
  private annees: number[];
  zonesList: number[] = [1,2,3];
  dvdFormats: DvdFormat[] = [DvdFormat.BLUERAY, DvdFormat.DVD];
  origines: Origine[] = OriginesWithoutTous
  origine = Origine;
  readonly dvdOrigineEnum = Origine.DVD
  readonly enSalleOrigineEnum = Origine.EN_SALLE
  updated = false;
  initOrigine: Origine
  zoneSelected: number
  formatSelected : DvdFormat
  rippedSelected: boolean = false
  constructor(private filmService: FilmService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    this.buttonDisabled = true;
    this.filmService.getFilm(this.route.snapshot.params['id']).subscribe({
      next: (_film) => {
        this.film = _film;
        this.initSelectedFields()
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
  private initSelectedFields(){
    this.zoneSelected = this.film.dvd && this.film.dvd.zone
    this.formatSelected = this.film.dvd && this.film.dvd.format
    this.rippedSelected = this.film.dvd && this.film.dvd.ripped
  }
  private checkIfCritiquePresseExist(){
    if (this.film.critiquePresse && this.film.critiquePresse.length > 0) {
      // console.log('ngOnInit this.film.critiquesPresse');
    } else {
      // console.log('ngOnInit !! this.film.critiquesPresse');
      this.critiquePresseExist = false;
    }
  }
  createDateVu() {
    console.log("createDateVu", this.film.vu);
  if (this.film.vu) {
    this.film.dateVue = new Date();
  } else {
    // TRÈS IMPORTANT : On réinitialise la date si on décoche "vu"
    this.film.dateVue = null; 
  }
}
  createDateRip(){
    if(this.rippedSelected){
      if(this.film.dvd == null){
        this.film.dvd = {zone: this.zoneSelected?this.zoneSelected:2,ripped : this.rippedSelected, format: this.formatSelected?this.formatSelected:DvdFormat.DVD, dateRip: new Date()}
      }else{
        this.film.dvd.dateRip = new Date();
      }
    }
  }

  formatDate(date?: Date | null): string | null {
    if (!date) return null;

    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${d.getFullYear()}-${month}-${day}`;
  }

  updateFilm() {
    this.updated = false;
    this.loading = true;
    this.buttonDisabled = true;

    if (this.film.origine === Origine.DVD) {
      let drip = this.film.dvd != null && this.film.dvd.dateRip != null ? this.film.dvd.dateRip : new Date()
      this.film.dvd = { zone: this.zoneSelected ? this.zoneSelected : 2, ripped: this.rippedSelected, format: this.formatSelected ? this.formatSelected : DvdFormat.DVD, dateRip: drip }

      const filmToSend = {
        ...this.film,
        dateSortieDvd: this.film.dateSortieDvd,
        dateSortie: this.formatDate(this.film.dateSortie),
        dateInsertion: this.formatDate(this.film.dateInsertion),
        dateMaj: this.formatDate(this.film.dateMaj),
        dateVue: this.formatDate(this.film.dateVue)
      };
    }

    //console.log("updateFilm",this.film)
    return this.filmService.updateFilm(this.film).subscribe({
      next: (f) => {
        console.log("updateFilm updated",f)
        this.film = f;
        console.log("updateFilm updated",this.film)
        this.initSelectedFields()
        this.store.updateLocalFilm(f);
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
