import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FilmListParam } from '../model/film-list-param';
import { Personne } from '../model/personne';
import { Film } from '../model/film';
import { Genre } from '../model/genre';
import { Origine } from '../model/origine';
import { FicheFilm } from '../model/fiche-film';
import * as FileSaver from 'file-saver';
import { Page } from '../model/page';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
const encodedAuth = window.localStorage.getItem('encodedAuth');
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(protected http: HttpClient) { }

  private readonly backendUrl = '/dvdtheque-service'

  private createdisplayTypeParam(displayType: string,limitFilmSize: number): HttpParams {
    let params = new HttpParams();
    params = params.append('displayType', displayType);
    if(limitFilmSize > 0){
      params = params.append('limitFilmSize', limitFilmSize.toString());
    }
    return params;
  }

  findFilmListParamByFilmDisplayTypeParam(origine: string, displayType: string, limitFilmSize: number): Observable<FilmListParam> {
    const params: HttpParams = this.createdisplayTypeParam(displayType, limitFilmSize);
    return this.http.get<FilmListParam>(this.backendUrl + '/filmListParam/byOrigine/' + origine, { params: params });
  }

  getAllFilmsByOrigineAndDisplayType(origine: string, displayType: string): Observable<Film[]> {
    const params: HttpParams = this.createdisplayTypeParam(displayType, 0);
    return this.http.get<Film[]>(this.backendUrl + '/films/byOrigine/' + origine, { params: params });
  }
  getAllCritiquePresseByAllocineFilmByTitle(title: string): Observable<FicheFilm[]> {
    let params = new HttpParams();
    params = params.append('title', title);
    return this.http.get<FicheFilm[]>(this.backendUrl + '/films/allocine/byTitle', { params: params });
  }
  getAllTmdbFilmsByTitre(titre: string): Observable<Film[]> {
    return this.http.get<Film[]>(this.backendUrl + '/films/tmdb/byTitre/' + titre);
  }

  getFilm(id: number): Observable<Film> {
    return this.http.get<Film>(this.backendUrl + '/films/byId/' + id);
  }

  getAllActeursByOrigine(origine: string, displayType: string): Observable<Personne[]> {
    // console.log('ApiService::getAllActeursByOrigine::displayType', displayType, origine);
    const params: HttpParams = this.createdisplayTypeParam(displayType, 0);
    return this.http.get<Personne[]>(this.backendUrl + '/acteurs/byOrigine/' + origine, { params: params });
  }

  getAllGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.backendUrl + '/films/genres');
  }

  getAllRealisateursByOrigine(origine: string, displayType: string): Observable<Personne[]> {
    // console.log('ApiService::getAllRealisateursByOrigine::displayType', displayType, origine);
    const params: HttpParams = this.createdisplayTypeParam(displayType, 0);
    return this.http.get<Personne[]>(this.backendUrl + '/realisateurs/byOrigine/' + origine, { params: params });
  }

  saveFilm(tmdbId: number, filmOrigine: Origine): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.backendUrl + '/films/save/' + tmdbId, filmOrigine, httpOptions).pipe(
      tap(_ => console.log(`added film id=${tmdbId}`))
    );
  }

  updateFilm(film: Film): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //console.log('apiUr=' + this.backendUrl + '/films/update/' + film.id);
    return this.http.put(this.backendUrl + '/films/update/' + film.id, film, httpOptions).pipe(
      tap(_ => console.log(`updated film id=${film.id}`))
    );
  }

  replaceFilm(film: Film, tmdbId: number): Observable<Film> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put<Film>(this.backendUrl + '/films/tmdb/' + tmdbId, film, httpOptions);
  }

  retrieveFilmImage(id: number): Observable<Film> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put<Film>(this.backendUrl + '/films/retrieveImage/' + id, httpOptions);
  }

  retrieveAllFilmImages(): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put<any>(this.backendUrl + '/films/retrieveAllImages/', httpOptions);
  }

  cleanAllCaches(): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put<any>(this.backendUrl + '/films/cleanCaches', httpOptions);
  }

  removeFilm(id: number): Observable<Film> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put<Film>(this.backendUrl + '/films/remove/' + id, httpOptions);
  }

  importFilmList(formdata: FormData): Observable<any> {
    const url = '/films/import';
    //console.log('importFilmList');
    return this.http.post(this.backendUrl + '/films/import', formdata).pipe(
      tap(_ => console.log('importFilmList done')));
  }

  exportFilmList(origine: Origine) {
    return this.http.post(this.backendUrl + '/films/export', origine, {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + encodedAuth,
        'Content-Type': 'application/octet-stream',
      }), responseType: 'blob'
    });
  }
  exportFilmSearch(query: string) {
    return this.http.post(this.backendUrl + '/films/search/export', query, {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + encodedAuth,
        'Content-Type': 'application/octet-stream',
      }), responseType: 'blob'
    });
  }
  search(query: string,offset: number, limit: number,sort: string): Observable<Film[]>{
    let params = new HttpParams();
    params = params.append('query', query).append('offset', offset.toString()).append('limit', limit.toString()).append('sort', sort);
    return this.http.get<Film[]>(this.backendUrl + '/films/search', { params: params });
  }
  paginatedSarch(query: string,offset: number, limit: number,sort: string): Observable<Page>{
    let params = new HttpParams();
    params = params.append('query', query).append('offset', offset.toString()).append('limit', limit.toString()).append('sort', sort);
    return this.http.get<Page>(this.backendUrl + '/films/paginatedSarch', { params: params });
  }
  saveAsExcelFile(data: any, fileName: string): void {
    const blob: Blob = new Blob([data], { type: EXCEL_TYPE });
    FileSaver.saveAs(blob, fileName);
  }
}
function tap(arg0: (_: any) => void): import("rxjs").OperatorFunction<Object, any> {
  throw new Error('Function not implemented.');
}

