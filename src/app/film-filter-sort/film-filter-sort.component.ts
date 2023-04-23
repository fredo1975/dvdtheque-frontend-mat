import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FilmFilterSort } from '../model/film-filter-sort';
import { Genre } from '../model/genre';
import { Origine } from '../model/origine';
import { FilmService } from '../services/film.service';

@Component({
  selector: 'app-film-filter-sort',
  templateUrl: './film-filter-sort.component.html',
  styleUrls: ['./film-filter-sort.component.css']
})
export class FilmFilterSortComponent implements OnInit{
  @Output() filmFilterSortChange = new EventEmitter<FilmFilterSort>();
  filmFilterSort: FilmFilterSort = {titre:'',default:true,realisateur:'',acteur:'',origine:Origine.DVD,annee:'',categorie: '',vu:'',ripped:'',sortBy: ''}
  buttonDisabled = false
  origines: Origine[] = [Origine.DVD,Origine.EN_SALLE,Origine.GOOGLE_PLAY,Origine.TV]
  Origine = Origine
  annees: number[]
  categories: Genre[]
  vuOptions: string[] = ['vu','non vu']
  rippedOptions: string[] = ['rippé','non rippé']
  sortByOptions: string[] = ['titre asc','titre desc','realisateur asc' ,'realisateur desc','acteur asc','acteur desc','annee asc','annee desc']
  sortBySelected: string
  constructor(private filmService: FilmService) {
  }
  ngOnInit() {
    this.annees = this.filmService.getAnneesSelect();
    this.filmService.getAllGenres().subscribe((data: Genre[]) => {
      this.categories = data;
    }
      , (error) => {
        //this.errorOccured = true;
        //this.loading = false;
        console.error(error);
      }
      , () => {
        //this.loading = false;
      });
  }
  filter(){
    //console.log(this.filmFilterSort);
    this.filmFilterSort.default=false
    this.filmFilterSort.sortBy = this.sortBySelected
    this.filmFilterSortChange.emit(this.filmFilterSort)
  }
  resetFields(){
    this.sortBySelected = ''
    this.filmFilterSort={titre:'',default: true,realisateur:'',acteur:'',origine:'',annee:'',categorie: '',vu:'',ripped:'',sortBy: ''}
    this.filmFilterSortChange.emit(this.filmFilterSort)
  }
}
