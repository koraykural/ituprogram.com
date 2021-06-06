import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertComma',
})
export class ConvertCommaPipe implements PipeTransform {
  transform(value: string[], ...args: unknown[]): unknown {
    return value.join('\n').trim();
  }
}
