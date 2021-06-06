import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  map,
  mergeMap,
  pluck,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { ApiClass, ClassRepresentation } from 'src/app/interfaces';
import { ApiService } from '../../services/api.service';
import { TableHeader, headers } from '../../table-headers';

interface Selection {
  term: string;
  code: string;
}

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements OnInit {
  drawerOpen = false;
  isBigScreen$ = this.breakpointObserver
    .observe('(min-width: 820px)')
    .pipe(pluck('matches'));

  selection$ = new BehaviorSubject<Selection | null>(null);
  loading$ = new BehaviorSubject<boolean>(false);
  filter$ = new BehaviorSubject<string>('');
  shownData$ = combineLatest([
    this.selection$.pipe(
      filter((selection): selection is Selection => selection !== null),
      tap(() => {
        this.loading$.next(true);
      }),
      mergeMap(({ term, code }) =>
        this.apiService.getArchive(term, code).pipe(catchError(() => of([])))
      ),
      tap(() => {
        this.loading$.next(false);
      }),
      map<ApiClass[], ClassRepresentation[]>((data) =>
        data.map((course) => ({
          ...course,
          days: course.days.join('\n'),
          hours: course.hours.join('\n'),
          buildings: course.buildings.join('\n'),
          restricts: course.restricts.join(', '),
          preReqs: course.preReqs.join(' ,'),
        }))
      )
    ),
    this.filter$.pipe(debounceTime(100)),
  ]).pipe(
    map(([courses, filter]) =>
      filter
        ? courses.filter((course) => this._filter(course, filter))
        : courses
    )
  );
  headers$ = new BehaviorSubject<TableHeader[]>([...headers]);

  constructor(
    private breakpointObserver: BreakpointObserver,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {}

  private _filter(course: ClassRepresentation, filter: string): boolean {
    const { code, name, lecturer, days, buildings, crn } = course;
    const courseStr = `${code} ${name} ${lecturer} ${days} ${buildings} ${crn}`;
    return courseStr
      .toLocaleLowerCase('tr')
      .includes(filter.toLocaleLowerCase('tr'));
  }
}
