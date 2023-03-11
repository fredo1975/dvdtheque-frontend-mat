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
  query: string = ''
  sort: string = ''
  constructor(protected filmService: FilmService) { 
    //this.films = [];
  }
  ngOnInit(): void {
    //console.log('FilmListComponent::ngOnInit');
    this.getFilms({query:'origine:eq:DVD:AND,', pageIndex:1, pageSize:this.defaultPageSize, sort:'-dateInsertion,-titre'});
  }

  protected getFilms(request: any) {
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
    this.getFilms({query:this.query, pageIndex:e.pageIndex+1, pageSize:e.pageSize, sort:this.sort});
  }

  filterOnFilmFilterSort() {
    //console.log(this.filmFilterSortViewChild.filmFilterSort);
    this.query = ''
    this.sort = ''
    if(!this.filmFilterSortViewChild.filmFilterSort.default){
      if(this.filmFilterSortViewChild.filmFilterSort.titre != ''){
        this.query+='titre:eq:'+this.filmFilterSortViewChild.filmFilterSort.titre+':AND,'
      }
      if(this.filmFilterSortViewChild.filmFilterSort.realisateur != ''){
        this.query += 'realisateur:eq:'+this.filmFilterSortViewChild.filmFilterSort.realisateur+':AND,'
      }
      if(this.filmFilterSortViewChild.filmFilterSort.acteur != ''){
        this.query += 'acteur:eq:'+this.filmFilterSortViewChild.filmFilterSort.acteur+':AND,'
      }
      if(this.filmFilterSortViewChild.filmFilterSort.origine != ''){
        this.query += 'origine:eq:'+this.filmFilterSortViewChild.filmFilterSort.origine+':AND,'
      }
      if(this.filmFilterSortViewChild.filmFilterSort.annee != ''){
        this.query += 'dateSortie:eq:'+this.filmFilterSortViewChild.filmFilterSort.annee+':AND,'
      }
      if(this.filmFilterSortViewChild.filmFilterSort.categorie != ''){
        this.query += 'genre:eq:'+this.filmFilterSortViewChild.filmFilterSort.categorie+':AND,'
      }
      if(this.filmFilterSortViewChild.filmFilterSort.vu != ''){
        if(this.filmFilterSortViewChild.filmFilterSort.vu === 'vu'){
          this.query += 'vu:eq:true:AND,'
        }else{
          this.query += 'vu:eq:false:AND,'
        }
      }
      if(this.filmFilterSortViewChild.filmFilterSort.ripped != ''){
        if(this.filmFilterSortViewChild.filmFilterSort.ripped === 'rippé'){
          this.query += 'dvd:eq:true:AND,'
        }else{
          this.query += 'dvd:eq:false:AND,'
        }
      }
      if(this.filmFilterSortViewChild.filmFilterSort.sortBy != ''){
        if(this.filmFilterSortViewChild.filmFilterSort.sortBy === 'titre asc'){
          this.sort += '+titre,'
        }else if(this.filmFilterSortViewChild.filmFilterSort.sortBy === 'titre desc'){
          this.sort += '-titre,'
        }else if(this.filmFilterSortViewChild.filmFilterSort.sortBy === 'annee asc'){
          this.sort += '+annee,'
        }else if(this.filmFilterSortViewChild.filmFilterSort.sortBy === 'annee desc'){
          this.sort += '-annee,'
        }else if(this.filmFilterSortViewChild.filmFilterSort.sortBy === 'acteur asc'){
          this.sort += '+acteur,'
        }else if(this.filmFilterSortViewChild.filmFilterSort.sortBy === 'acteur desc'){
          this.sort += '-acteur,'
        }
      }
      //console.log('query',this.query);
      //console.log('sort',this.sort);
    }
    this.getFilms({query:this.query, pageIndex:1, pageSize:this.defaultPageSize, sort:this.sort})
    
  }
}
