import { Component, ViewChild, inject } from '@angular/core';
import { FilmFilterSortComponent } from '../film-filter-sort/film-filter-sort.component';
import { PageEvent } from '@angular/material/paginator';
import { FilmStore } from '../store/film.store';
import { FilmFilterSort } from '../model/film-filter-sort';
import { Origine } from '../model/origine';

@Component({
  selector: 'app-film-list',
  templateUrl: './film-list.component.html',
  styleUrls: ['./film-list.component.css']
})
export class FilmListComponent {
  store = inject(FilmStore);
  films = this.store.films;
  totalElements = this.store.totalElements;
  loading = this.store.loading;
  errorOccured = this.store.errorOccured;
  pageSize = this.store.pageSize;

  dvdOrigineEnum = Origine.DVD;
  displayedColumns: string[] = ['id', 'titre'];

  handlePageEvent(e: PageEvent) {
    this.store.setPage(e.pageIndex + 1);
    this.store.setPageSize(e.pageSize);
  }
}