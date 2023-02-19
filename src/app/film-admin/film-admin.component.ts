import { Component, OnInit } from '@angular/core';
import { FilmListComponent } from '../film-list/film-list.component';
import { Film } from '../model/film';

@Component({
  selector: 'app-film-admin',
  templateUrl: './film-admin.component.html',
  styleUrls: ['./film-admin.component.css']
})
export class FilmAdminComponent extends FilmListComponent implements OnInit {
  buttonDisabled = false
  private film: Film
  displayedColumns: string[] = ['poster', 'titre', 'titreO', 'realisateurs', 'acteurs', 'annee', 'action']
  
  removeFilm(id: number) {
    const confir = confirm('Sûr de supprimer le film ?')
    if (confir) {
      this.buttonDisabled = true
      this.loading = true
      this.errorOccured = false
      // console.log('id=', id);
      this.filmService.removeFilm(id).subscribe({
        next: (obs: Film) => {
          //console.log('film with id : ' + id + ' removed')
        },
        error: (e) => {
          console.log(e)
          this.buttonDisabled = false
          this.errorOccured = true
        },
        complete: () => {
          this.buttonDisabled = false
          this.loading = false
          this.getFilms({ query: '', pageIndex: 1, pageSize: this.defaultPageSize, sort: '-dateInsertion,-titre' })
        }
      })

    }
  }

  retrieveAllFilmImages() {
    const confir = confirm('Sûr de récupérer toutes les images manquantes ?');
    if (confir) {
      this.buttonDisabled = true
      this.loading = true
      this.errorOccured = false
      // console.log('id=', id);
      this.filmService.retrieveAllFilmImages().subscribe(obs => {
        //console.log('all images retrieved');
      }
        , (error) => { 
          console.log(error)
          this.buttonDisabled = false
          this.errorOccured = true
        }
        , () => {
          // console.log('removeFilm Fini !');
          this.buttonDisabled = false;
          this.loading = false;
          // console.log('fremoveFilm', this.filmService.getOrigine(), this.filmService.getDisplayType());
          //this.filterOnDisplayTypeAndOrigine(this.filmService.getDisplayType(), this.filmService.getOrigine());
        });
    }
  }

  retrieveFilmImage(id: number) {
    const confir = confirm('Sûr de récupérer le poster pour le film id=' + id + '?')
    if (confir) {
      this.buttonDisabled = true
      this.loading = true
      this.errorOccured = false
      // console.log('id=', id);
      this.filmService.retrieveFilmImage(id).subscribe({
        next: (obs: Film) => {
          //console.log('image retrieved for film with id : ' + id)
          this.loading = false
        },
        error: (e) => {
          console.log(e);
          this.buttonDisabled = false
          this.loading = false
          this.errorOccured = true
        },
        complete: () => {
          this.buttonDisabled = false
          this.getFilms({ query: '', pageIndex: 1, pageSize: this.defaultPageSize, sort: '-dateInsertion,-titre' })
        }
      })
    }
  }
}
