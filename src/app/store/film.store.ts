import { Injectable, signal, computed, inject, effect, NgZone } from '@angular/core';
import { FilmService } from '../services/film.service';
import { Film } from '../model/film';
import { EMPTY, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Origine } from '../model/origine';
import { toObservable } from '@angular/core/rxjs-interop';
import { FilmFilterSort } from '../model/film-filter-sort';
import { switchMap } from 'rxjs/operators';

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

  // On combine les paramètres dans un computed pour réagir à n'importe quel changement
  private requestParams = computed(() => ({
    query: this.query(),
    pageIndex: this.pageIndex(),
    pageSize: this.pageSize(),
    sort: this.sort()
  }));

  constructor() {
    this.initFromCookie();
    // 1. Définition de l'observable à partir du signal (CONTEXTE OK ICI)
    // 2. On pipe directement pour gérer les appels API
    toObservable(this.requestParams).pipe(
      tap(() => this.loading.set(true)),
      switchMap(req => {
        let q = req.query;
        if (q.includes(`origine:eq:${Origine.TOUS}:AND`)) q = '';

        return this.filmService.paginatedSarch(q, req.pageIndex, req.pageSize, req.sort).pipe(
          catchError((err) => {
            console.error('Erreur API:', err);
            this.errorOccured.set(true);
            this.loading.set(false);
            return of(null);
          })
        );
      })
    ).subscribe(data => {
      if (data) {
        this.films.set(data.content);
        this.totalElements.set(data.page.totalElements);
        this.errorOccured.set(false);
      }
      this.loading.set(false);
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
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value || "")}${expires}; path=/; SameSite=Lax`;
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
    return this.filmService.removeFilm(id).pipe(
        tap(() => {
          const updated = this.films().filter(f => f.id !== id);
          this.films.set(updated);
        })
      );
  }

  retrieveFilmImage(id: number): Observable<Film> {
    return this.filmService.retrieveFilmImage(id);
  }

  /**
   * Méthode unique pour mettre à jour les filtres depuis le composant
   */
  updateFromFilter(filter: FilmFilterSort) {
    const query = this.buildQuery(filter);
    const sort = this.mapSort(filter.sortBy);

    // On met à jour les signaux de base
    this.pageIndex.set(1);
    this.query.set(query);
    this.sort.set(sort);

    // Gestion du cookie d'origine
    if (filter.origine) {
      this.setCookie('origine', filter.origine, 30);
    }
  }

  /**
   * Transforme l'objet de filtre en chaîne de caractère pour le backend
   */
  private buildQuery(f: FilmFilterSort): string {
    const parts: string[] = [];

    // Mapping simple (clé: valeur)
    if (f.titre) parts.push(`titre:eq:${f.titre}:AND`);
    if (f.realisateur) parts.push(`realisateur:eq:${f.realisateur}:AND`);
    if (f.acteur) parts.push(`acteur:eq:${f.acteur}:AND`);
    if (f.annee) parts.push(`dateSortie:eq:${f.annee}:AND`);
    if (f.categorie) parts.push(`genre:eq:${f.categorie}:AND`);

    // Cas particuliers (Origine & Vu)
    if (f.origine && f.origine !== Origine.TOUS) {
      parts.push(`origine:eq:${f.origine}:AND`);
    }

    if (f.vu === 'vu') parts.push(`vu:eq:true:AND`);
    if (f.vu === 'non vu') parts.push(`vu:eq:false:AND`);

    return parts.join(',');
  }

  /**
   * Mapping des options de tri lisibles vers les paramètres API
   */
  private mapSort(sortBy: string): string {
    const sortMap: Record<string, string> = {
      'titre asc': '+titre',
      'titre desc': '-titre',
      'annee asc': '+annee',
      'annee desc': '-annee',
      'acteur asc': '+acteur',
      'acteur desc': '-acteur'
    };
    return sortMap[sortBy] ?? '-dateInsertion,+titre';
  }

  /**
 * Force le rechargement complet de la liste à partir du serveur
 */
  refreshList() {
    // On récupère la requête actuelle (stockée en cookie ou signal)
    const currentQuery = this.query();

    // On ré-applique la requête. 
    // Si le signal ne change pas de valeur, Angular ne déclenchera rien.
    // On peut donc "forcer" en repassant par le cookie.
    this.initFromCookie();

    console.log('Liste synchronisée avec les dernières modifications.');
  }

  updateLocalFilm(updatedFilm: Film) {
  this.films.update(films => 
    films.map(f => f.id === updatedFilm.id ? { ...updatedFilm } : f)
  );
}
}