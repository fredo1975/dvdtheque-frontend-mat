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
  }

  filterOnFilmFilterSort(filter: FilmFilterSort) {
    const queryParts: string[] = [];
    if (filter.titre) queryParts.push(`titre:eq:${filter.titre}:AND`);
    if (filter.realisateur) queryParts.push(`realisateur:eq:${filter.realisateur}:AND`);
    if (filter.acteur) queryParts.push(`acteur:eq:${filter.acteur}:AND`);
    if (filter.origine) queryParts.push(`origine:eq:${filter.origine}:AND`);
    if (filter.annee) queryParts.push(`dateSortie:eq:${filter.annee}:AND`);
    if (filter.categorie) queryParts.push(`genre:eq:${filter.categorie}:AND`);
    if (filter.vu === 'vu') queryParts.push(`vu:eq:true:AND`);
    if (filter.vu === 'non vu') queryParts.push(`vu:eq:false:AND`);

    const query = queryParts.join(',');
    const sortMap: Record<string,string> = {
      'titre asc': '+titre',
      'titre desc': '-titre',
      'annee asc': '+annee',
      'annee desc': '-annee',
      'acteur asc': '+acteur',
      'acteur desc': '-acteur'
    };
    const sort = sortMap[filter.sortBy] ?? '-dateInsertion,+titre';

    //console.log('Generated query:', query);
    queueMicrotask(() => this.store.setFilter(query, sort));
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