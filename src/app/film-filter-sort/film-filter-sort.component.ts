import { Component, EventEmitter, Output, signal, effect } from '@angular/core';
import { FilmFilterSort } from '../model/film-filter-sort';
import { Origine } from '../model/origine';
import { Genre } from '../model/genre';

@Component({
  selector: 'app-film-filter-sort',
  templateUrl: './film-filter-sort.component.html',
  styleUrls: ['./film-filter-sort.component.css']
})
export class FilmFilterSortComponent {

  @Output() filterChange = new EventEmitter<FilmFilterSort>();

  // signal principal pour les filtres
  filmFilterSort = signal<FilmFilterSort>({
    titre: '',
    default: true,
    realisateur: '',
    acteur: '',
    origine: Origine.DVD,
    annee: '',
    categorie: '',
    vu: '',
    ripped: '',
    sortBy: ''
  });

  // listes de sélection
  origines = signal(Object.values(Origine).filter(o => o !== Origine.TOUS).sort() as Origine[]);
  categories = signal<Genre[]>([]);
  vuOptions = ['vu', 'non vu'];
  rippedOptions = ['rippé', 'non rippé'];
  sortByOptions = ['titre asc','titre desc','realisateur asc','realisateur desc','acteur asc','acteur desc','annee asc','annee desc'];

  constructor() {
    // 🔥 auto emission dès que le signal change
    effect(() => {
      this.filterChange.emit(this.filmFilterSort());
    });
  }

  // update générique d’un champ
  updateField<K extends keyof FilmFilterSort>(key: K, value: FilmFilterSort[K]) {
    this.filmFilterSort.update(f => ({ ...f, [key]: value, default: false }));
  }

  // reset du filtre
  reset() {
    this.filmFilterSort.set({
      titre: '',
      default: true,
      realisateur: '',
      acteur: '',
      origine: Origine.DVD,
      annee: '',
      categorie: '',
      vu: '',
      ripped: '',
      sortBy: ''
    });
  }

}