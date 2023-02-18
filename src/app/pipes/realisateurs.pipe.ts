import { Pipe, PipeTransform } from '@angular/core';
import { Personne } from '../model/personne';

@Pipe({
  name: 'realisateurs'
})
export class RealisateursPipe implements PipeTransform {

  transform(realisateurs: Personne[], args?: any): any {
    let str = '';
    //console.log(realisateurs);
    realisateurs.forEach(element => {
      str = str.concat(element.nom, ', ');
    });
    str = str.substring(0, str.length - 2);
    return str;
  }

}
