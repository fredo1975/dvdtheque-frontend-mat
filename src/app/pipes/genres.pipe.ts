import { Pipe, PipeTransform } from '@angular/core';
import { Genre } from '../model/genre';

@Pipe({
  name: 'genres'
})
export class GenresPipe implements PipeTransform {

  transform(genres: Genre[], args?: any): any {
    let str = '';
    genres.forEach(element => {
      str = str.concat(element.name, ', ');
    });
    str = str.substring(0, str.length - 2);
    return str;
  }

}
