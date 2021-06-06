import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map, pluck, tap, withLatestFrom } from 'rxjs/operators';
import { AppState } from 'src/app/state/app.state';
import { selectProgram } from '../../state/selectors';
import * as programActions from '../../state/program/program.actions';
import { Day, Filter } from 'src/app/interfaces';
import { combineLatest, Subject } from 'rxjs';
import { SubSink } from 'subsink';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
})
export class SidePanelComponent implements OnInit, OnDestroy {
  @Output() drawerClose = new EventEmitter<void>();

  private subs = new SubSink();
  filter$ = this.store.pipe(select(selectProgram), pluck('filter'));
  hideMajorRestricted$ = this.filter$.pipe(pluck('hideMajorRestricted'));
  hideAlternatives$ = this.filter$.pipe(pluck('hideAlternatives'));
  hideConflicts$ = this.filter$.pipe(pluck('hideConflicts'));
  sortByAlternatives$ = this.store.pipe(
    select(selectProgram),
    pluck('sort', 'by'),
    map((by) => by === 'alternative-count')
  );

  private allCodes$ = this.store.pipe(
    select(selectProgram),
    pluck('courses'),
    map((courses) => [...new Set(courses.map((course) => course.code))])
  );
  private visibleCodes$ = this.filter$.pipe(pluck('codes'));
  codes$ = combineLatest([this.allCodes$, this.visibleCodes$]).pipe(
    map(([allCodes, visibleCodes]) =>
      allCodes.map((code) => ({
        code,
        selected: visibleCodes.includes(code),
      }))
    )
  );
  codeSelectionChange$ = new Subject<{ code: string; selected: boolean }>();
  daySelectionChange$ = new Subject<{ day: Day; selected: boolean }>();
  isBigScreen$ = this.breakpointObserver
    .observe('(min-width: 820px)')
    .pipe(pluck('matches'));

  private days: Day[] = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
  days$ = this.filter$.pipe(
    pluck('days'),
    map((visibleDays) =>
      this.days.map((day) => ({
        day: day,
        selected: visibleDays.includes(day),
      }))
    )
  );

  constructor(
    private store: Store<AppState>,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.codeSelectionChange$
      .pipe(
        withLatestFrom(this.visibleCodes$),
        map(([selectionChange, codes]) => {
          if (selectionChange.selected) {
            return [...codes, selectionChange.code];
          } else {
            return codes.filter((code) => code !== selectionChange.code);
          }
        })
      )
      .subscribe((codes) => {
        this.store.dispatch(
          programActions.updateFilter({
            filter: {
              codes,
            },
          })
        );
      });

    this.subs.sink = this.daySelectionChange$
      .pipe(
        withLatestFrom(this.days$),
        map(([selectionChange, days]) => {
          const visibleDays = days
            .filter((day) => day.selected)
            .map((day) => day.day);
          if (selectionChange.selected) {
            return [...visibleDays, selectionChange.day];
          } else {
            return visibleDays.filter((day) => day !== selectionChange.day);
          }
        })
      )
      .subscribe((days) => {
        this.store.dispatch(
          programActions.updateFilter({
            filter: {
              days,
            },
          })
        );
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  updateFilter(filter: Partial<Filter>): void {
    this.store.dispatch(programActions.updateFilter({ filter }));
  }

  updateSort(sortByAlternatives: boolean): void {
    this.store.dispatch(
      programActions.updateSort({
        sort: {
          by: sortByAlternatives ? 'alternative-count' : 'code',
          order: 'asc',
        },
      })
    );
  }
}
