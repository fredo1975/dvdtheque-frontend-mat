import { Component, OnInit } from '@angular/core';
import { Origine } from '../model/origine';
import { FilmService } from '../services/film.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';

const EXCEL_EXTENSION = '.xlsx';

@Component({
    selector: 'app-film-export',
    templateUrl: './film-export.component.html',
    styleUrls: ['./film-export.component.css'],
    standalone: true,
    imports: [MatIcon, MatFormField, MatLabel, MatSelect, ReactiveFormsModule, FormsModule, NgFor, MatOption, MatHint, MatButton, NgIf, MatProgressSpinner]
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