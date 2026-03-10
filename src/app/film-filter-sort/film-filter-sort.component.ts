import { Component, EventEmitter, Output, signal} from '@angular/core';
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
    origine: this.getOrigineFromCookie(),
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
  sortByOptions = ['titre asc', 'titre desc', 'realisateur asc', 'realisateur desc', 'acteur asc', 'acteur desc', 'annee asc', 'annee desc'];

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

  private getOrigineFromCookie(): Origine {
    const origineCookie = this.getCookie('origine');
    if (origineCookie && Object.values(Origine).includes(origineCookie as Origine)) {
      return origineCookie as Origine;
    }
    return Origine.DVD;
  }

  updateField<K extends keyof FilmFilterSort>(key: K, value: FilmFilterSort[K]) {
    this.filmFilterSort.update(f => {
      const newFilter = { ...f, [key]: value, default: false };

      // On émet manuellement ici : c'est une action utilisateur, pas un effet de bord
      this.filterChange.emit(newFilter);

      return newFilter;
    });
  }

  // 3. Pareil pour le reset
  reset() {
    const defaultFilter: FilmFilterSort = {
      titre: '', default: true, realisateur: '', acteur: '',
      origine: Origine.TOUS, annee: '', categorie: '',
      vu: '', ripped: '', sortBy: ''
    };
    this.filmFilterSort.set(defaultFilter);
    this.filterChange.emit(defaultFilter);
  }

}