import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FicheFilm } from '../model/fiche-film';
import { Film } from '../model/film';
import { FilmListParam } from '../model/film-list-param';
import { Genre } from '../model/genre';
import { Origine } from '../model/origine';
import { Page } from '../model/page';
import { Personne } from '../model/personne';
import { ApiService } from './api.service';

const nonRenseigne = 'Non renseigné';
@Injectable({
  providedIn: 'root'
})
export class FilmService {

  private origine!: string;
  private displayType!: string;
  private limitFilmSize!: number;
  constructor(private apiService: ApiService) {
  }

  setOrigine(origine: string) {
    this.origine = origine;
  }

  setDisplayType(displayType: string) {
    this.displayType = displayType;
  }

  getDisplayType() {
    return this.displayType;
  }

  getOrigine(): string {
    return this.origine;
  }
  getLimitFilmSize(): number{
    return this.limitFilmSize;
  }
  findFilmListParamByFilmDisplayTypeParam(origine: string, displayType: string, limitFilmSize: number): Observable<FilmListParam> {
    return this.apiService.findFilmListParamByFilmDisplayTypeParam(origine, displayType, limitFilmSize);
  }
  getAllCritiquePresseByAllocineFilmByTitle(title: string): Observable<FicheFilm[]> {
    return this.apiService.getAllCritiquePresseByAllocineFilmByTitle(title);
  }
  getAllFilmsByOrigineAndDisplayType(origine: string, displayType: string): Observable<Film[]> {
    return this.apiService.getAllFilmsByOrigineAndDisplayType(origine, displayType);
  }
  getAllTmdbFilmsByTitre(titre: string) {
    return this.apiService.getAllTmdbFilmsByTitre(titre);
  }

  getFilm(id: number): Observable<Film> {
    return this.apiService.getFilm(id);
  }

  getAllGenres(): Observable<Genre[]> {
    return this.apiService.getAllGenres();
  }

  getAllActeursByOrigine(origine: string, displayType: string): Observable<Personne[]> {
    return this.apiService.getAllActeursByOrigine(origine, displayType);
  }

  getAllRealisateursByOrigine(origine: string, displayType: string): Observable<Personne[]> {
    return this.apiService.getAllRealisateursByOrigine(origine, displayType);
  }

  updateFilm(film: Film): Observable<any> {
    return this.apiService.updateFilm(film);
  }

  replaceFilm(film: Film, tmdbId: number): Observable<any> {
    return this.apiService.replaceFilm(film, tmdbId);
  }

  removeFilm(id: number): Observable<any> {
    return this.apiService.removeFilm(id);
  }

  retrieveFilmImage(id: number): Observable<any> {
    return this.apiService.retrieveFilmImage(id);
  }

  retrieveAllFilmImages(): Observable<any> {
    return this.apiService.retrieveAllFilmImages();
  }

  cleanAllCaches(): Observable<any> {
    return this.apiService.cleanAllCaches();
  }

  saveFilm(tmdbId: number, filmOrigine: Origine): Observable<any> {
    return this.apiService.saveFilm(tmdbId, filmOrigine);
  }

  exportFilmList(origine: Origine) {
    return this.apiService.exportFilmList(origine);
  }
  exportFilmSearch(query: string) {
    return this.apiService.exportFilmSearch(query);
  }
  importFilmList(formdata: FormData): Observable<any> {
    return this.apiService.importFilmList(formdata);
  }

  getAnneesSelect = () => {
    const anneeList = [];
    const currentTime = new Date();
    const yyyy = currentTime.getFullYear();
    // anneeList.push(nonRenseigne);
    for (let i = yyyy; i > 1930; i--) {
      anneeList.push(i);
    }
    return anneeList;
  }

  getLimitFilmSizeSelect = () => {
    const limitFilmSizeList = [];
    // anneeList.push(nonRenseigne);
    for (let i = 10; i <= 100; i=i+10) {
      limitFilmSizeList.push(i);
    }
    return limitFilmSizeList;
  }

  setLimitFilmSize(limitFilmSizeList: number) {
    this.limitFilmSize = limitFilmSizeList;
  }

  search(query: string, offset: number, limit: number,sort: string): Observable<Film[]>{
    return this.apiService.search(query,offset,limit, sort);
  }
  paginatedSarch(query: string, offset: number, limit: number,sort: string): Observable<Page>{
    return this.apiService.paginatedSarch(query,offset,limit, sort);
  }
  saveAsExcelFile(data: any, fileName: string): void {
    this.apiService.saveAsExcelFile(data,fileName);
  }
}
