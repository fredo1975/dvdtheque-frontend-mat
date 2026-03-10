import { Component, OnInit } from '@angular/core';
import { Origine } from '../model/origine';
import { FilmService } from '../services/film.service';

const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-film-export',
  templateUrl: './film-export.component.html',
  styleUrls: ['./film-export.component.css']
})
export class FilmExportComponent implements OnInit {
  loading = false;
  buttonDisabled = false;
  // Utilisation de la constante centralisée pour les origines
  origines: Origine[] = Object.values(Origine);
  origine: Origine;
  errorOccured = false;
  exportSuccess = false;

  constructor(private filmService: FilmService) { }

  ngOnInit() { }

  exportFilmList() {
    if (!this.origine) {
      return; // Le bouton est normalement désactivé par le template
    }

    this.buttonDisabled = true;
    this.loading = true;
    this.errorOccured = false;
    this.exportSuccess = false;

    const fileName = 'Export_DVDtheque';
    
    this.filmService.exportFilmList(this.origine).subscribe({
      next: (data: any) => {
        const timestamp = new Date().toISOString().split('T')[0];
        this.filmService.saveAsExcelFile(data, `${fileName}_${this.origine}_${timestamp}${EXCEL_EXTENSION}`);
        this.exportSuccess = true;
      },
      error: (e) => {
        console.error('Erreur export:', e);
        this.errorOccured = true;
        this.loading = false;
        this.buttonDisabled = false;
      },
      complete: () => {
        this.loading = false;
        this.buttonDisabled = false;
      }
    });
  }
}