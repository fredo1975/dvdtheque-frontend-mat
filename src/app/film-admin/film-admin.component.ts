import { Component, inject, signal } from '@angular/core';
import { FilmStore } from '../store/film.store';
import { FilmFilterSort } from '../model/film-filter-sort';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-film-admin',
  templateUrl: './film-admin.component.html',
  styleUrls: ['./film-admin.component.css']
})
export class FilmAdminComponent {
  store = inject(FilmStore);

  // Signaux du store
  films = this.store.films;
  totalElements = this.store.totalElements;
  loading = this.store.loading;
  pageSize = this.store.pageSize;

  // UI
  errorOccured = signal(false);
  isProcessing = signal(false); // Plus précis que buttonDisabled

  displayedColumns: string[] = ['titre', 'realisateur', 'annee', 'actions'];

  handlePageEvent(e: PageEvent) {
    this.store.setPage(e.pageIndex + 1);
    this.store.setPageSize(e.pageSize);
  }

  // Actions Admin
  removeFilm(id: number, titre: string) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement "${titre}" ?`)) {
      this.isProcessing.set(true);
      this.store.removeFilm(id).subscribe({
        next: () => this.isProcessing.set(false),
        error: () => {
          this.errorOccured.set(true);
          this.isProcessing.set(false);
        }
      });
    }
  }

  retrieveFilmImage(id: number) {
    this.isProcessing.set(true);
    this.store.retrieveFilmImage(id).subscribe({
      next: () => this.isProcessing.set(false),
      error: () => {
        this.errorOccured.set(true);
        this.isProcessing.set(false);
      }
    });
  }
}