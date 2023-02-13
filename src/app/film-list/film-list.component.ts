import { Component, OnInit } from '@angular/core';
import { Film } from '../model/film';
import { Page } from '../model/page';
import { FilmService } from '../services/film.service';
import {PageEvent} from '@angular/material/paginator';
import { Origine } from '../model/origine';

@Component({
  selector: 'app-film-list',
  templateUrl: './film-list.component.html',
  styleUrls: ['./film-list.component.css']
})
export class FilmListComponent implements OnInit{
  films: Film[] = [];
  loading: boolean;
  errorOccured: boolean;
  totalElements: number = 0;
  displayedColumns: string[] = ['id', 'titre'];
  Origine = Origine;
  readonly dvdOrigineEnum = Origine.DVD

  constructor(protected filmService: FilmService) { 
    //this.films = [];
  }
  ngOnInit(): void {
    console.log('FilmListComponent::ngOnInit');
    this.getFilms({query:'', pageIndex:1, pageSize:12, sort:''});
  }

  private getFilms(request: any) {
    this.loading = true;
    this.filmService.paginatedSarch(request.query, request.pageIndex, request.pageSize,request.sort).subscribe((data: Page) => {
      this.films = data.content;
      this.totalElements = data.totalElements;
      // tslint:disable-next-line:max-line-length
      //this.filmListParam = { realisateurs: data.realisateurs, acteurs: data.acteurs, films: data.films, genres: data.genres, realisateursLength: data.realisateursLength, acteursLength: data.acteursLength };
    }
      , (error) => {
        this.errorOccured = true;
        this.loading = false;
        console.log(error);
      }
      , () => {
        this.loading = false;
      });
  }
  handlePageEvent(e: PageEvent) {
    //console.log(e);
    this.getFilms({query:'', pageIndex:e.pageIndex+1, pageSize:e.pageSize, sort:''});
  }
}
