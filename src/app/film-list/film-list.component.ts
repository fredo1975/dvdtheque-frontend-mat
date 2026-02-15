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
  defaultPageSize: number = 50;
  query: string = ''
  sort: string = ''
  constructor(protected filmService: FilmService) { 
    //this.films = [];
  }

  private setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

private getCookie(name: string): string | null {
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

  ngOnInit(): void {
    //console.log('FilmListComponent::ngOnInit');
    // Lire le cookie origine si présent
    const origineCookie = this.getCookie('origine');
    const origineValue = origineCookie ? origineCookie : 'DVD';
    const itemsPerPageCookie = this.getCookie('itemsPerPage');
    const itemsPerPageValue = itemsPerPageCookie ? parseInt(itemsPerPageCookie) : this.defaultPageSize;
    // Affecter la valeur au filtre du composant enfant AVANT la requête
    if (this.filmFilterSortViewChild && this.filmFilterSortViewChild.filmFilterSort) {
      this.filmFilterSortViewChild.filmFilterSort.origine = origineValue;
    }
    this.query += `origine:eq:${origineValue}:AND,`;
    this.sort += '-dateInsertion,+titre'
    this.defaultPageSize = itemsPerPageValue;
    this.getFilms({query:this.query, pageIndex:1, pageSize:itemsPerPageValue, sort:this.sort});
  }

  protected getFilms(request: any) {
    this.loading = true;

    this.filmService.paginatedSarch(request.query, request.pageIndex, request.pageSize,request.sort).subscribe({
      next: (data: Page) => {
        console.log(data);
        this.films = data.content;
        this.totalElements = data.page.totalElements;
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
    this.defaultPageSize = e.pageSize;
    // Stocker dans le cookie pour 30 jours
    this.setCookie('itemsPerPage', e.pageSize.toString(), 30);
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
        // Stocker dans le cookie pour 30 jours
        this.setCookie('origine', this.filmFilterSortViewChild.filmFilterSort.origine, 30);
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
