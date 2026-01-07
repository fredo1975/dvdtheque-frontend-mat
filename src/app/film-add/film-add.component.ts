import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Film } from '../model/film';
import { Origine , OriginesWithoutTous} from '../model/origine';
import { FilmService } from '../services/film.service';

@Component({
  selector: 'app-film-add',
  templateUrl: './film-add.component.html',
  styleUrls: ['./film-add.component.css']
})
export class FilmAddComponent implements OnInit{
  private film: Film;
  titre: string;
  tmdbFilms: Film[] = [];
  buttonDisabled = false;
  loading = false;
  origines: Origine[] = OriginesWithoutTous;
  origine: Origine;
  errorOccured: boolean;
  completedStatus: string;
  displayedColumns: string[] = ['poster','titre','titreO','realisateurs','acteurs','annee','alreadyInDvdtheque'];
  
  constructor(private filmService: FilmService, private route: ActivatedRoute, private router: Router) {
  }
  ngOnInit() {
  }

  serachTmdbFilm() {
    if (this.titre == null || this.titre === '') {
      alert('il faut un titre pour faire une recherche');
      return;
    }
    // console.log('this.titre=' + this.titre);
    this.buttonDisabled = true;
    this.loading = true;
    this.errorOccured = false;
    this.filmService.getAllTmdbFilmsByTitre(this.titre).subscribe((data: Film[]) => {
      if(data){
        this.tmdbFilms = data;
      }else{
        this.tmdbFilms = [];
      }
      //console.log(this.tmdbFilms);
    }
      , (error) => {
        this.errorOccured = true;
        this.loading = false;
        this.buttonDisabled = false;
        console.error(error);
      }
      , () => {
        //console.log('serachTmdbFilm Fini !',this.tmdbFilms);
        this.buttonDisabled = false;
        this.errorOccured = false;
        this.loading = false;
      });
  }

  saveFilm(tmdbId: number) {
    if (this.origine == null) {
      alert('il faut une origine au film pour l\'ajouter');
      return;
    }
    this.buttonDisabled = true;
    this.loading = true;
    this.errorOccured = false;

    this.filmService.saveFilm(tmdbId, this.origine).subscribe({
      next: (filmSaved: Film) => {
        this.film = filmSaved
        this.tmdbFilms = []
      },
      error: (e) => {
        this.errorOccured = true
        this.buttonDisabled = false
        console.error(e)
        this.loading = false
      },
      complete: () => {
        this.buttonDisabled = false
        this.loading = false
        this.router.navigate(['/filmDetail/' + this.film.id])
      }
    })
  }

  resetTmdbFilm() {
    this.tmdbFilms = [];
    this.titre = '';
  }
}
