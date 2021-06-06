import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-program-select',
  templateUrl: './program-select.component.html',
  styleUrls: ['./program-select.component.scss'],
})
export class ProgramSelectComponent implements OnInit {
  drawerOpen = false;
  isBigScreen$ = this.breakpointObserver
    .observe('(min-width: 820px)')
    .pipe(pluck('matches'));
  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {}
}
