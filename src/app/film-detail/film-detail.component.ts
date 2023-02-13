import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DvdFormat } from '../model/dvd-format';
import { Film } from '../model/film';
import { FilmService } from '../services/film.service';

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css']
})
export class FilmDetailComponent implements OnInit{
  @Input() film: Film;
  loading = false;
  buttonDisabled = false;
  errorOccured = false;
  private critiquePresseExist = true;
  private annees: number[];
  private zonesList: number[];
  private dvdFormats: string[];
  constructor(private filmService: FilmService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    this.buttonDisabled = true;
    this.filmService.getFilm(this.route.snapshot.params['id']).subscribe(_film => {
      this.film = _film;
      //console.log(this.film)
    }
      , (error) => {
        console.log('an error occured when fetching film with id : ' + this.route.snapshot.params['id']);
        this.loading = false;
      }
      , () => {
        this.checkIfCritiquePresseExist();
        this.loading = false;
      });
    
    this.buttonDisabled = false;
    this.annees = this.filmService.getAnneesSelect();
    this.zonesList = this.getZonesList();
    //this.dvdFormats = [null, DvdFormat[DvdFormat.BLUERAY], DvdFormat[DvdFormat.DVD]];
  }
  getZonesList = () => {
    const zonesList = [];
    for (let i = 1; i < 4; i++) {
      zonesList.push(i);
    }
    return zonesList;
  }
  private checkIfCritiquePresseExist(){
    if (this.film.critiquePresse && this.film.critiquePresse.length > 0) {
      // console.log('ngOnInit this.film.critiquesPresse');
    } else {
      // console.log('ngOnInit !! this.film.critiquesPresse');
      this.critiquePresseExist = false;
    }
  }
}
