import { Component, OnInit } from '@angular/core';
import { AllocineService } from '../services/allocine.service';
import { Page } from '../model/page';
import { FicheFilm } from '../model/fiche-film';
import { FicheFilmPage } from '../model/fiche-film-page';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-film-allocine',
  templateUrl: './film-allocine.component.html',
  styleUrls: ['./film-allocine.component.css']
})
export class FilmAllocineComponent implements OnInit{
  loading: boolean;
  errorOccured: boolean;
  totalElements: number = 0;
  ficheFilms: FicheFilm[] = [];
  query: string = ''
  sort: string = '+title'
  title: string = ''
  buttonDisabled = false
  readonly defaultPageSize: number = 50;
  displayedColumns: string[] = ['titre', 'id', 'allocineFilmId', 'url', 'pageNumber','creationDate']
  sortByOptions: string[] = ['created date asc','created date desc']
  sortBySelected: string
  ngOnInit(): void {
    console.log('FilmAllocineComponent::ngOnInit');
  }

  constructor(protected allocineService: AllocineService) { 
    //this.films = [];
    this.getAllFicheFilms({query:this.query, pageIndex:1, pageSize:this.defaultPageSize, sort:this.sort});
  }

  protected getAllFicheFilms(request: any) {
    this.loading = true;
    this.allocineService.paginatedSearch(request.query, request.pageIndex, request.pageSize,request.sort).subscribe({
      next: (data: FicheFilmPage) => {
        this.ficheFilms = data.content;
        this.totalElements = data.totalElements;
      },
      error: (e) => {
        this.errorOccured = true;
        this.loading = false;
        console.error(e);
      },
      complete: () => {
        this.loading = false;
      }
    }
    )
  }

  handlePageEvent(e: PageEvent) {
    //console.log(e);
    this.getAllFicheFilms({query:this.query, pageIndex:e.pageIndex+1, pageSize:e.pageSize, sort:this.sort});
  }

  filter(){
    if(this.title != ''){
      this.query = 'title:eq:'+this.title+':AND';
    }
    if(this.sortBySelected != '' && this.sortBySelected === 'created date asc'){
      this.sort = '+creationDate'
    } else if(this.sortBySelected != '' && this.sortBySelected === 'created date desc'){
      this.sort = '-creationDate'
    }
    this.getAllFicheFilms({query: this.query, pageIndex:1, pageSize:this.defaultPageSize, sort:this.sort});
  }
  sortByCreationDate(){
    this.sort= ''
  }
  resetFields(){
    this.query = ''
    this.sort = ''
    this.sortBySelected = ''
    this.title = ''
    this.getAllFicheFilms({query: this.query, pageIndex:1, pageSize:this.defaultPageSize, sort:this.sort});
  }
}
