import { animate, style, transition, trigger } from '@angular/animations';

export const smoothHeight = trigger('grow', [
  transition('void <=> *', []),
  transition(
    '* <=> *',
    [style({ height: '{{startHeight}}px' }), animate('.4s ease-out')],
    {
      params: { startHeight: 0 },
    }
  ),
]);
