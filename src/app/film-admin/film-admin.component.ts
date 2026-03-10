import { Component, inject } from '@angular/core';
import { FilmStore } from '../store/film.store';
import { FilmFilterSort } from '../model/film-filter-sort';
import { PageEvent } from '@angular/material/paginator';
import { signal } from '@angular/core';

@Component({
  selector: 'app-film-admin',
  templateUrl: './film-admin.component.html',
  styleUrls: ['./film-admin.component.css']
})
export class FilmAdminComponent {

  store = inject(FilmStore);

  // signals
  films = this.store.films; // WritableSignal<Film[]>
  totalElements = this.store.totalElements; // WritableSignal<number>
  loading = this.store.loading; // WritableSignal<boolean>
  pageSize = this.store.pageSize; // WritableSignal<number>

  // erreurs et UI
  errorOccured = signal(false);
  buttonDisabled = false;

  // table
  displayedColumns: string[] = ['titre', 'realisateur', 'annee', 'actions'];

  // pagination
  handlePageEvent(e: PageEvent) {
    this.store.setPage(e.pageIndex + 1);
    this.store.setPageSize(e.pageSize);
  }

  filterOnFilmFilterSort(filter: FilmFilterSort) {
    this.store.updateFromFilter(filter);
  }

  // actions admin
  removeFilm(id: number) {
    this.buttonDisabled = true;
    this.store.removeFilm(id).subscribe({
      next: () => this.buttonDisabled = false,
      error: () => {
        this.errorOccured.set(true);
        this.buttonDisabled = false;
      }
    });
    this.buttonDisabled = false;
  }

  retrieveFilmImage(id: number) {
    this.buttonDisabled = true;
    this.store.retrieveFilmImage(id).subscribe({
      next: () => this.buttonDisabled = false,
      error: () => {
        this.errorOccured.set(true);
        this.buttonDisabled = false;
      }
    });
  }
}