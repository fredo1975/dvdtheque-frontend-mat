import { Component, AfterViewInit, ViewChild, inject } from '@angular/core';
import { FilmFilterSortComponent } from '../film-filter-sort/film-filter-sort.component';
import { PageEvent } from '@angular/material/paginator';
import { FilmStore } from '../store/film.store';
import { FilmFilterSort } from '../model/film-filter-sort';
import { Film } from '../model/film';
import { Origine } from '../model/origine';

@Component({
  selector: 'app-film-list',
  templateUrl: './film-list.component.html',
  styleUrls: ['./film-list.component.css']
})
export class FilmListComponent {
  store = inject(FilmStore);

  @ViewChild(FilmFilterSortComponent, { static: true })
  filmFilterSortViewChild!: FilmFilterSortComponent;

  dvdOrigineEnum = Origine.DVD;
  displayedColumns: string[] = ['id', 'titre'];

  get films(): Film[] { return this.store.films(); }
  get totalElements(): number { return this.store.totalElements(); }
  get pageSize(): number { return this.store.pageSize(); }
  get loading(): boolean { return this.store.loading(); }
  get errorOccured(): boolean { return this.store.errorOccured(); }

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
}