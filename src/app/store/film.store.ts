import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { FilmService } from '../services/film.service';
import { Film } from '../model/film';
import { Page } from '../model/page';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FilmStore {

  private filmService = inject(FilmService);

  films = signal<Film[]>([]);
  totalElements = signal(0);
  loading = signal(false);
  errorOccured = signal(false);

  query = signal('');
  sort = signal('-dateInsertion,+titre');
  pageIndex = signal(1);
  pageSize = signal(50);

  request = computed(() => ({
    query: this.query(),
    sort: this.sort(),
    pageIndex: this.pageIndex(),
    pageSize: this.pageSize()
  }));

  constructor() {

    effect(() => {

      const req = this.request();

      this.loading.set(true);

      this.filmService
        .paginatedSarch(req.query, req.pageIndex, req.pageSize, req.sort)
        .subscribe({
          next: (data: Page) => {
            this.films.set(data.content);
            this.totalElements.set(data.page.totalElements);
            this.loading.set(false);
          },
          error: () => {
            this.errorOccured.set(true);
            this.loading.set(false);
          }
        });

    });

  }

  setFilter(query: string, sort: string) {
    this.pageIndex.set(1);
    this.query.set(query);
    this.sort.set(sort);
  }

  setPage(pageIndex: number) {
    this.pageIndex.set(pageIndex);
  }

  setPageSize(pageSize: number) {
    this.pageSize.set(pageSize);
  }

  // Supprimer un film
  removeFilm(id: number): Observable<void> {
    return new Observable<void>(observer => {
      this.filmService.removeFilm(id).subscribe({
        next: () => {
          // Mettre à jour la liste locale après suppression
          const updated = this.films().filter(f => f.id !== id);
          this.films.set(updated);
          observer.next();
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  // Récupérer l'image d'un film
  retrieveFilmImage(id: number): Observable<Film> {
    return new Observable<Film>(observer => {
      this.filmService.retrieveFilmImage(id).subscribe({
        next: (imageUrl) => {
          observer.next(imageUrl);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }
}