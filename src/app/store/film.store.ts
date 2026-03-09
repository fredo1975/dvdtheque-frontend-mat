import { Injectable, signal, computed, inject, effect, NgZone } from '@angular/core';
import { FilmService } from '../services/film.service';
import { Film } from '../model/film';
import { Page } from '../model/page';
import { EMPTY, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Origine } from '../model/origine';
import { DvdFormat } from '../model/dvd-format';

@Injectable({ providedIn: 'root' })
export class FilmStore {

  private filmService = inject(FilmService);
  private zone = inject(NgZone);

  films = signal<Film[]>([]);
  totalElements = signal<number>(0);
  loading = signal<boolean>(false);
  errorOccured = signal<boolean>(false);

  query = signal<string>('');
  sort = signal<string>('-dateInsertion,+titre');
  pageIndex = signal<number>(1);
  pageSize = signal<number>(50);

  request = computed(() => ({
    query: this.query(),
    sort: this.sort(),
    pageIndex: this.pageIndex(),
    pageSize: this.pageSize()
  }));

  constructor() {
    effect(() => {
      const req = this.request();
      this.zone.runOutsideAngular(() => {
        setTimeout(() => this.loadFilms(req.query, req.pageIndex, req.pageSize, req.sort), 0);
      });
    });
  }

  private loadFilms(query: string, pageIndex: number, pageSize: number, sort: string) {
    this.zone.run(() => this.loading.set(true));
    this.zone.run(() => this.errorOccured.set(false));
    const matchNoFilter = query.match(/origine:eq:([^:]+):AND/);
    if (matchNoFilter && matchNoFilter[1] === Origine.TOUS) query = '';
    this.filmService.paginatedSarch(query, pageIndex, pageSize, sort)
      .subscribe({
        next: (data: Page) => {
          this.zone.run(() => {
            if (data) {
              this.films.set(data.content);
              this.totalElements.set(data.page.totalElements);
            }
            this.loading.set(false);
          });
        },
        error: () => {
          this.zone.run(() => {
            this.errorOccured.set(true);
            this.loading.set(false);
          });
        }
      });
  }

  public initFromCookie() {
    const origineCookie = this.getCookie('origine');
    const origineValue = origineCookie && Object.values(Origine).includes(origineCookie as Origine)
      ? origineCookie
      : Origine.DVD;

    const itemsPerPageCookie = this.getCookie('itemsPerPage');
    const pageSizeValue = itemsPerPageCookie ? parseInt(itemsPerPageCookie) : 50;

    // set initial values
    this.pageSize.set(pageSizeValue);
    this.query.set(`origine:eq:${origineValue}:AND,`);
    this.sort.set('-dateInsertion,+titre');
  }

  
  setFilter(query: string, sort: string) {
    this.pageIndex.set(1);
    this.query.set(query);
    this.sort.set(sort);

    const match = query.match(/origine:eq:([^:]+):AND/);
    if (match) this.setCookie('origine', match[1], 30);
  }

  setPage(pageIndex: number) {
    this.pageIndex.set(pageIndex);
  }

  setPageSize(pageSize: number) {
    this.pageSize.set(pageSize);
    this.setCookie('itemsPerPage', pageSize.toString(), 30);
  }

  // 🔹 Gestion des cookies
  private setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
  }

  public getCookie(name: string): string | null {
    if (!document.cookie) return null;
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [key, ...rest] = cookie.split('=');
      if (key === name) {
        return decodeURIComponent(rest.join('='));
      }
    }
    return null;
  }

  removeFilm(id: number): Observable<void> {
    const confir = confirm('Sûr de supprimer le film ?')
    if (confir) {
      return this.filmService.removeFilm(id).pipe(
        tap(() => {
          const updated = this.films().filter(f => f.id !== id);
          this.films.set(updated);
        })
      );
    }
    return EMPTY;
  }

  retrieveFilmImage(id: number): Observable<Film> {
    return this.filmService.retrieveFilmImage(id);
  }
}