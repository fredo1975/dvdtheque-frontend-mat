import { Pipe, PipeTransform } from '@angular/core';
import { Origine, OrigineLabel } from '../model/origine';

@Pipe({
    name: 'origineLabel',
    standalone: true
})
export class OrigineLabelPipe implements PipeTransform {

  transform(origine: Origine | null | undefined): string {
    if (!origine) return '';
    return OrigineLabel[origine] ?? origine;
  }

}