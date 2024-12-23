import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs';
import { FicheFilm } from '../model/fiche-film';
import { Film } from '../model/film';
import { FilmService } from '../services/film.service';

@Component({
  selector: 'app-film-update-critiquepresse',
  templateUrl: './film-update-critiquepresse.component.html',
  styleUrls: ['./film-update-critiquepresse.component.css']
})
export class FilmUpdateCritiquepresseComponent implements OnInit {
  ficheFilmTab: FicheFilm[];
  film: Film;
  loading = false;
  buttonDisabled = false;
  errorOccured = false;
  updated = false;
  private critiquePresseExist = true;
  constructor(protected filmService: FilmService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loading = true;

    this.filmService.getFilm(this.route.snapshot.params['id']).pipe(
      switchMap(
        film => {
          this.film = film
          console.log(film)
          return this.filmService.getAllCritiquePresseByAllocineFilmByTitle(film.titre)
        }
      )
    ).subscribe(_ficheFilmTab => {
      this.ficheFilmTab = _ficheFilmTab.slice();
      console.log(this.ficheFilmTab)
      this.loading = false
    }
      , (error) => {
        console.log('an error occured when fetching allocine film with title : ' + this.film.titre);
        this.loading = false;
      });
  }

  getCurrentFilm = () => {
    return (this.filmService.getFilm(this.route.snapshot.params['id'])).pipe(map(film => film));
  }

  getAllCritiquePresseByAllocineFilmByTitle = (film: { titre: string; }) => {
    return this.filmService.getAllCritiquePresseByAllocineFilmByTitle(film.titre);
  }
  choose(id: number) {
    console.log(id)
    const filmUpdated = {allocineFicheFilmId: id} = this.film
    this.loading = true;
    this.buttonDisabled = true;
    this.filmService.updateFilm(filmUpdated).subscribe({
      next: (f: Film) => {
        this.film = f;
        console.log('updateFilm film f =',f);
      },
      error: (e) => {
        this.errorOccured = true;
        this.loading = false;
        this.buttonDisabled = false;
        console.error(e);
      },
      complete: () => {
        this.loading = false;
        this.buttonDisabled = false;
        this.updated = true;
      }
    })
  }
}
