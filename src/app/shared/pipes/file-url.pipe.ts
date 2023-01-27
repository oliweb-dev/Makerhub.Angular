import {Pipe, PipeTransform} from '@angular/core';
import {environment} from 'src/environments/environment';

@Pipe({
   name: 'fileUrl',
})
export class FileUrlPipe implements PipeTransform {
   transform(value: string, ext: string): string {
      return `${environment.apiUrl}/File/${value}.${ext}`;
   }
}
