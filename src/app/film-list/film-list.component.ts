import { Component, ViewChild, inject } from '@angular/core';
import { FilmFilterSortComponent } from '../film-filter-sort/film-filter-sort.component';
import { PageEvent } from '@angular/material/paginator';
import { FilmStore } from '../store/film.store';
import { FilmFilterSort } from '../model/film-filter-sort';

@Component({
  selector: 'app-film-list',
  templateUrl: './film-list.component.html',
  styleUrls: ['./film-list.component.css']
})
export class FilmListComponent {

  store = inject(FilmStore);

  @ViewChild(FilmFilterSortComponent, { static: true })
  filmFilterSortViewChild!: FilmFilterSortComponent;

  displayedColumns: string[] = ['id', 'titre'];

  handlePageEvent(e: PageEvent) {
    this.store.setPage(e.pageIndex + 1);
    this.store.setPageSize(e.pageSize);

    document.cookie = `itemsPerPage=${e.pageSize}; path=/; max-age=${60 * 60 * 24 * 30}`;
  }

  filterOnFilmFilterSort(filter: FilmFilterSort) {
    const queryParts: string[] = [];

    if (filter.titre) queryParts.push(`titre:eq:${filter.titre}:AND`);
    if (filter.realisateur) queryParts.push(`realisateur:eq:${filter.realisateur}:AND`);
    if (filter.acteur) queryParts.push(`acteur:eq:${filter.acteur}:AND`);
    if (filter.origine) {
      queryParts.push(`origine:eq:${filter.origine}:AND`);
      document.cookie = `origine=${filter.origine}; path=/; max-age=${60 * 60 * 24 * 30}`;
    }
    if (filter.annee) queryParts.push(`dateSortie:eq:${filter.annee}:AND`);
    if (filter.categorie) queryParts.push(`genre:eq:${filter.categorie}:AND`);

    if (filter.vu === 'vu') queryParts.push(`vu:eq:true:AND`);
    if (filter.vu === 'non vu') queryParts.push(`vu:eq:false:AND`);

    const query = queryParts.join(',');

    const sortMap: Record<string, string> = {
      'titre asc': '+titre',
      'titre desc': '-titre',
      'annee asc': '+annee',
      'annee desc': '-annee',
      'acteur asc': '+acteur',
      'acteur desc': '-acteur'
    };

    const sort = sortMap[filter.sortBy] ?? '-dateInsertion,+titre';

    this.store.setFilter(query, sort);
  }

}