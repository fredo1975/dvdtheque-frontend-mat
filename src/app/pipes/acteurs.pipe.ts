import { Pipe, PipeTransform } from '@angular/core';
import { Personne } from '../model/personne';

@Pipe({
  name: 'acteurs'
})
export class ActeursPipe implements PipeTransform {
  transform(acteurs: Personne[]): string {
    if (!acteurs || acteurs.length === 0) return '';
    return acteurs.map(a => `${a.nom}`).join(', ');
  }
}