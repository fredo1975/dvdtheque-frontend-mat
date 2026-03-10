import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Film } from '../model/film';
import { Origine, OriginesWithoutTous } from '../model/origine';
import { FilmService } from '../services/film.service';
import { FilmStore } from '../store/film.store';

@Component({
  selector: 'app-film-add',
  templateUrl: './film-add.component.html',
  styleUrls: ['./film-add.component.css']
})
export class FilmAddComponent implements OnInit {
  private store = inject(FilmStore);
  film: Film;
  titre: string = '';
  tmdbFilms: Film[] = [];
  buttonDisabled = false;
  loading = false;
  origines: Origine[] = OriginesWithoutTous;
  origine: Origine;
  errorOccured = false;

  constructor(private filmService: FilmService, private router: Router) {}

  ngOnInit() {}

  serachTmdbFilm() {
    if (!this.titre?.trim()) {
      alert('Il faut un titre pour faire une recherche');
      return;
    }

    this.buttonDisabled = true;
    this.loading = true;
    this.errorOccured = false;
    this.tmdbFilms = [];

    this.filmService.getAllTmdbFilmsByTitre(this.titre).subscribe({
      next: (data: Film[]) => {
        this.tmdbFilms = data || [];
      },
      error: (e) => {
        this.errorOccured = true;
        this.loading = false;
        this.buttonDisabled = false;
        console.error(e);
      },
      complete: () => {
        this.buttonDisabled = false;
        this.loading = false;
      }
    });
  }

  saveFilm(tmdbId: number) {
    if (!this.origine) {
      alert('Il faut choisir une origine avant d\'ajouter le film');
      return;
    }
    
    this.loading = true;
    this.buttonDisabled = true;

    this.filmService.saveFilm(tmdbId, this.origine).subscribe({
      next: (filmSaved: Film) => {
        this.film = filmSaved;
        this.store.refreshList(); // On prévient le store du nouvel ajout
      },
      error: (e) => {
        this.errorOccured = true;
        this.loading = false;
        this.buttonDisabled = false;
      },
      complete: () => {
        this.router.navigate(['/filmDetail/' + this.film.id]);
      }
    });
  }

  resetTmdbFilm() {
    this.tmdbFilms = [];
    this.titre = '';
    this.errorOccured = false;
  }
}