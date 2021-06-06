import {
  Directive,
  OnChanges,
  Input,
  HostBinding,
  ElementRef,
} from '@angular/core';

@Directive({
  selector: '[smoothHeight]',
  host: { '[style.display]': '"block"', '[style.overflow]': '"hidden"' },
})
export class SmoothHeightDirective implements OnChanges {
  @Input() smoothHeight: any;
  pulse: boolean = true;
  startHeight: number = 100;

  constructor(private element: ElementRef) {}

  @HostBinding('@grow')
  get grow() {
    return { value: this.pulse, params: { startHeight: this.startHeight } };
  }

  setStartHeight() {
    this.startHeight = this.element.nativeElement.clientHeight;
  }

  ngOnChanges() {
    this.setStartHeight();
    this.pulse = !this.pulse;
  }
}
