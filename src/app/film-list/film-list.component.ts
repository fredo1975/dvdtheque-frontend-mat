import { Component, inject } from '@angular/core';
import { FilmFilterSortComponent } from '../film-filter-sort/film-filter-sort.component';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { FilmStore } from '../store/film.store';
import { Origine } from '../model/origine';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent, MatCardImage } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-film-list',
    templateUrl: './film-list.component.html',
    styleUrls: ['./film-list.component.css'],
    standalone: true,
    imports: [FilmFilterSortComponent, MatCard, MatCardContent, RouterLink, MatCardImage, MatPaginator, MatButtonModule]
})
export class FilmListComponent {
  store = inject(FilmStore);
  films = this.store.films;
  loading = this.store.loading;
  errorOccured = this.store.errorOccured;

  dvdOrigineEnum = Origine.DVD;
  skeletonItems = Array(10);

  handlePageEvent(e: PageEvent) {
    this.store.setPage(e.pageIndex + 1);
    this.store.setPageSize(e.pageSize);
  }

  retry() {
    this.store.retry();
  }

  formatRuntime(runtime: number): string {
    if (runtime <= 0) return '';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0
      ? `${hours}h` + (minutes > 0 ? ` ${minutes}min` : '')
      : `${minutes}min`;
  }
}