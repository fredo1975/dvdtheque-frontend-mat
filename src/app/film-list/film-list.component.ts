import { Component, ViewChild, inject } from '@angular/core';
import { FilmFilterSortComponent } from '../film-filter-sort/film-filter-sort.component';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { FilmStore } from '../store/film.store';
import { FilmFilterSort } from '../model/film-filter-sort';
import { Origine } from '../model/origine';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent, MatCardImage } from '@angular/material/card';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-film-list',
    templateUrl: './film-list.component.html',
    styleUrls: ['./film-list.component.css'],
    standalone: true,
    imports: [NgIf, FilmFilterSortComponent, NgFor, MatCard, MatCardContent, RouterLink, MatCardImage, MatPaginator]
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