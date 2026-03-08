import { Component, inject } from '@angular/core';
import { FilmStore } from '../store/film.store';
import { FilmFilterSort } from '../model/film-filter-sort';
import { PageEvent } from '@angular/material/paginator';
import { signal } from '@angular/core';
import { Film } from '../model/film';

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

  // erreurs et UI
  errorOccured = signal(false);
  buttonDisabled = false;

  // table
  displayedColumns: string[] = ['titre', 'realisateur', 'annee', 'actions'];

  // pagination
  handlePageEvent(e: PageEvent) {
    this.store.setPage(e.pageIndex + 1);
    this.store.setPageSize(e.pageSize);
    document.cookie = `itemsPerPage=${e.pageSize}; path=/; max-age=${60*60*24*30}`;
  }

  // filtre depuis le child component
  filterOnFilmFilterSort(filter: FilmFilterSort) {
    const queryParts: string[] = [];

    if (filter.titre) queryParts.push(`titre:eq:${filter.titre}:AND`);
    if (filter.realisateur) queryParts.push(`realisateur:eq:${filter.realisateur}:AND`);
    if (filter.acteur) queryParts.push(`acteur:eq:${filter.acteur}:AND`);

    const query = queryParts.join(',');

    const sort = '-dateInsertion,+titre';

    this.store.setFilter(query, sort);
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