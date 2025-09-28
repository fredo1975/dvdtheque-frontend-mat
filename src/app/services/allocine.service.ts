import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { FicheFilmPage } from '../model/fiche-film-page';

@Injectable({
  providedIn: 'root'
})
export class AllocineService {

  constructor(private apiService: ApiService) {
  }

  paginatedSearch(query: string, offset: number, limit: number,sort: string): Observable<FicheFilmPage>{
    return this.apiService.paginatedSearchAlloCine(query,offset,limit, sort);
  }
}
