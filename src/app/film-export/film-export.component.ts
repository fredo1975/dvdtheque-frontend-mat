import { Component, OnInit } from '@angular/core';
import { Origine } from '../model/origine';
import { FilmService } from '../services/film.service';

const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-film-export',
  templateUrl: './film-export.component.html',
  styleUrls: ['./film-export.component.css']
})
export class FilmExportComponent implements OnInit{
  loading = false;
  buttonDisabled = false;
  exportResult: any;
  origines: Origine[] = [Origine[Origine.TOUS],Origine[Origine.DVD], Origine[Origine.EN_SALLE], Origine[Origine.GOOGLE_PLAY], Origine[Origine.TV]];
  origine: Origine;
  errorOccured: boolean;

  constructor(private filmService: FilmService) {
  }
  ngOnInit() {
    
  }

  exportFilmList() {
    if (this.origine == null) {
      alert('il faut séléctionner quels films exporter : Tous, les dvd, les films en salle ...');
      return;
    }
    this.buttonDisabled = true;
    this.loading = true;
    this.errorOccured = false;
    const fileName = 'ListeDvdExport';
    //console.log(this.origine);
    this.filmService.exportFilmList(this.origine).subscribe((data: any) => {
      const now = Date.now();
      
      this.filmService.saveAsExcelFile(data, `${fileName}-${now}-${this.origine}` + EXCEL_EXTENSION);
    }
      , (error) => {
        console.error(error);
        this.buttonDisabled = false;
        this.loading = false;
        this.errorOccured = true;
      }
      , () => {
        this.buttonDisabled = false;
        this.loading = false;
      });
  }
}
