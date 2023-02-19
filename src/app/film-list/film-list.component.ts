import { Component, OnInit, ViewChild } from '@angular/core';
import { Film } from '../model/film';
import { Page } from '../model/page';
import { FilmService } from '../services/film.service';
import {PageEvent} from '@angular/material/paginator';
import { Origine } from '../model/origine';
import { FilmFilterSortComponent } from '../film-filter-sort/film-filter-sort.component';

@Component({
  selector: 'app-film-list',
  templateUrl: './film-list.component.html',
  styleUrls: ['./film-list.component.css']
})
export class FilmListComponent implements OnInit{
  @ViewChild(FilmFilterSortComponent, { static: true }) filmFilterSortViewChild: FilmFilterSortComponent;
  films: Film[] = [];
  loading: boolean;
  errorOccured: boolean;
  totalElements: number = 0;
  displayedColumns: string[] = ['id', 'titre'];
  Origine = Origine;
  readonly dvdOrigineEnum = Origine.DVD
  readonly defaultPageSize: number = 50;
  constructor(protected filmService: FilmService) { 
    //this.films = [];
  }
  ngOnInit(): void {
    //console.log('FilmListComponent::ngOnInit');
    this.getFilms({query:'', pageIndex:1, pageSize:this.defaultPageSize, sort:'-dateInsertion,-titre'});
  }

  private getFilms(request: any) {
    this.loading = true;

    this.filmService.paginatedSarch(request.query, request.pageIndex, request.pageSize,request.sort).subscribe({
      next: (data: Page) => {
        this.films = data.content;
        this.totalElements = data.totalElements;
      },
      error: (e) => {
        this.errorOccured = true;
        this.loading = false;
        console.log(e);
      },
      complete: () => {
        this.loading = false;
      }
    }
    )
  }

  handlePageEvent(e: PageEvent) {
    //console.log(e);
    this.getFilms({query:'', pageIndex:e.pageIndex+1, pageSize:e.pageSize, sort:''});
  }

  filterOnFilmFilterSort() {
    //console.log(this.filmFilterSortViewChild.filmFilterSort);
    let query = ''
    if(!this.filmFilterSortViewChild.filmFilterSort.default){
      if(this.filmFilterSortViewChild.filmFilterSort.titre != ''){
        query+='titre:eq:'+this.filmFilterSortViewChild.filmFilterSort.titre+':AND,'
      }
      if(this.filmFilterSortViewChild.filmFilterSort.realisateur != ''){
        query += 'realisateur:eq:'+this.filmFilterSortViewChild.filmFilterSort.realisateur+':AND,'
      }
      if(this.filmFilterSortViewChild.filmFilterSort.acteur != ''){
        query += 'acteur:eq:'+this.filmFilterSortViewChild.filmFilterSort.acteur+':AND,'
      }
      if(this.filmFilterSortViewChild.filmFilterSort.origine != ''){
        query += 'origine:eq:'+this.filmFilterSortViewChild.filmFilterSort.origine+':AND,'
      }
      if(this.filmFilterSortViewChild.filmFilterSort.annee != ''){
        query += 'dateSortie:eq:'+this.filmFilterSortViewChild.filmFilterSort.annee+':AND,'
      }
      if(this.filmFilterSortViewChild.filmFilterSort.categorie != ''){
        query += 'genre:eq:'+this.filmFilterSortViewChild.filmFilterSort.categorie+':AND,'
      }
      if(this.filmFilterSortViewChild.filmFilterSort.vu != ''){
        if(this.filmFilterSortViewChild.filmFilterSort.vu === 'vu'){
          query += 'vu:eq:true:AND,'
        }else{
          query += 'vu:eq:false:AND,'
        }
      }
      if(this.filmFilterSortViewChild.filmFilterSort.ripped != ''){
        if(this.filmFilterSortViewChild.filmFilterSort.ripped === 'rippé'){
          query += 'dvd:eq:true:AND,'
        }else{
          query += 'dvd:eq:false:AND,'
        }
      }
      //console.log('query',query);
    }
    this.getFilms({query:query, pageIndex:1, pageSize:this.defaultPageSize, sort:''})
    
  }
}
