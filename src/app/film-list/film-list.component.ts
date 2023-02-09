import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Film } from '../model/film';
import { FilmService } from '../services/film.service';

@Component({
  selector: 'app-film-list',
  templateUrl: './film-list.component.html',
  styleUrls: ['./film-list.component.css']
})
export class FilmListComponent implements OnInit{
  //films: Film[];
  loading = false;
  constructor(protected filmService: FilmService) { 
    //this.films = [];
  }
  ngOnInit(): void {
    console.log('FilmListComponent::ngOnInit');
    
  }
}
