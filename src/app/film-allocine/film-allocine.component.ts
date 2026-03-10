import { Component, OnInit } from '@angular/core';
import { AllocineService } from '../services/allocine.service';
import { FicheFilm } from '../model/fiche-film';
import { FicheFilmPage } from '../model/fiche-film-page';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-film-allocine',
  templateUrl: './film-allocine.component.html',
  styleUrls: ['./film-allocine.component.css']
})
export class FilmAllocineComponent implements OnInit {
  loading: boolean = false;
  errorOccured: boolean = false;
  totalElements: number = 0;
  ficheFilms: FicheFilm[] = [];
  
  // Paramètres de recherche
  query: string = '';
  sort: string = '-creationDate';
  title: string = '';
  
  buttonDisabled = false;
  readonly defaultPageSize: number = 50;
  
  displayedColumns: string[] = ['titre', 'id', 'allocineFilmId', 'url', 'pageNumber', 'creationDate'];
  sortByOptions = [
    { label: 'Date création (Décroissant)', value: '-creationDate' },
    { label: 'Date création (Croissant)', value: '+creationDate' }
  ];
  sortBySelected: string = '-creationDate';

  constructor(protected allocineService: AllocineService) { }

  ngOnInit(): void {
    this.refreshData(1, this.defaultPageSize);
  }

  private refreshData(pageIndex: number, pageSize: number) {
    this.loading = true;
    this.errorOccured = false;
    
    this.allocineService.paginatedSearch(this.query, pageIndex, pageSize, this.sort).subscribe({
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
    });
  }

  handlePageEvent(e: PageEvent) {
    this.refreshData(e.pageIndex + 1, e.pageSize);
  }

  filter() {
    this.query = this.title ? `title:eq:${this.title}:AND` : '';
    this.sort = this.sortBySelected;
    this.refreshData(1, this.defaultPageSize);
  }

  resetFields() {
    this.query = '';
    this.sort = '-creationDate';
    this.sortBySelected = '-creationDate';
    this.title = '';
    this.refreshData(1, this.defaultPageSize);
  }
}