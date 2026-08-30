import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, length = 90): string {
    if (!value || value.length <= length) return value ?? '';
    return `${value.slice(0, length).trimEnd()}…`;
  }
}
