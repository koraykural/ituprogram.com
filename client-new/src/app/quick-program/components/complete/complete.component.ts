import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map, pluck } from 'rxjs/operators';
import { AppState } from 'src/app/state/app.state';
import { selectProgram } from '../../state/selectors';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss'],
})
export class CompleteComponent implements OnInit {
  selectedCourses$ = this.store.pipe(
    select(selectProgram),
    pluck('selectedCourses')
  );
  crns$ = this.selectedCourses$.pipe(
    map((courses) => courses.map((course) => course.crn)),
    map((crns) => `[${crns.join(',')}]`)
  );

  constructor(private store: Store<AppState>, public clipboard: Clipboard) {}

  ngOnInit(): void {}
}
