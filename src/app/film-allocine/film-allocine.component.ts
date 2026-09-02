import { Component, OnInit } from '@angular/core';
import { AllocineService } from '../services/allocine.service';
import { FicheFilm } from '../model/fiche-film';
import { FicheFilmPage } from '../model/fiche-film-page';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';

@Component({
    selector: 'app-film-allocine',
    templateUrl: './film-allocine.component.html',
    styleUrls: ['./film-allocine.component.css'],
    standalone: true,
    imports: [MatFormField, MatLabel, MatInput, ReactiveFormsModule, FormsModule, MatIcon, MatSuffix, MatSelect, NgFor, MatOption, MatButton, NgIf, MatProgressSpinner, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator, DatePipe]
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