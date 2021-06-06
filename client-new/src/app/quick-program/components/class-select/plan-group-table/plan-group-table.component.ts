import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PlanClassGroup, PlanClassItem } from 'src/app/interfaces';
import { AppState } from 'src/app/state/app.state';
import { smoothHeight } from './animation';
import * as planCoursesActions from '../../../state/plan-courses/plan-courses.actions';
import { selectPlanCourses } from 'src/app/quick-program/state/selectors';
import { map, mergeMap, pluck, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, of } from 'rxjs';

@Component({
  selector: 'app-plan-group-table',
  templateUrl: './plan-group-table.component.html',
  styleUrls: ['./plan-group-table.component.scss'],
  animations: [smoothHeight],
})
export class PlanGroupTableComponent implements OnInit {
  @Input() index: number = 0;
  group: PlanClassGroup = {
    label: 'Undefined',
    items: [],
    isCollapsed: true,
  };
  group$ = this.store.pipe(
    select(selectPlanCourses),
    pluck('courses'),
    map((courses) => courses[this.index]),
    tap((value) => {
      this.group = value;
    })
  );
  hideNotOpened$ = this.store.pipe(
    select(selectPlanCourses),
    pluck('hideNotOpened')
  );
  allItems$ = this.group$.pipe(pluck('items'));
  openedItems$ = this.group$.pipe(
    pluck('items'),
    map((items) => items.filter((item) => item.isOpened))
  );
  isMasterChecked = false;
  isMasterChecked$ = this.openedItems$.pipe(
    map((items) => items.every((item) => item.selected)),
    tap((val) => {
      this.isMasterChecked = val;
    })
  );
  isMasterIndeterminate$ = this.openedItems$.pipe(
    map(
      (items) =>
        items.some((item) => item.selected) &&
        items.some((item) => !item.selected)
    )
  );
  visibleItems$ = combineLatest([
    this.hideNotOpened$,
    this.openedItems$,
    this.allItems$,
  ]).pipe(
    map(([hideNotOpened, openedItems, allItems]) =>
      hideNotOpened ? openedItems : allItems
    ),
    mergeMap((items) => combineLatest([of(items), this.expanded$])),
    map(([items, expanded]) =>
      items.length > 6 && !expanded ? items.slice(0, 3) : items
    )
  );
  showExpandButton$ = combineLatest([
    this.allItems$,
    this.openedItems$,
    this.hideNotOpened$,
  ]).pipe(
    map(([allItems, openedItems, hideNotOpened]) =>
      hideNotOpened ? openedItems.length > 6 : allItems.length > 6
    )
  );
  expanded$ = new BehaviorSubject<boolean>(false);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}

  toggleMaster(checked: boolean): void {
    const group = this.group;
    if (checked) {
      this.store.dispatch(planCoursesActions.addGroupCodes({ group }));
    } else {
      this.store.dispatch(planCoursesActions.removeGroupCodes({ group }));
    }
  }

  rowSelectionChange(code: string, selected: boolean): void {
    if (selected) {
      this.store.dispatch(planCoursesActions.addCode({ code }));
    } else {
      this.store.dispatch(planCoursesActions.removeCode({ code }));
    }
  }

  identify(index: number, item: PlanClassItem) {
    return item.selected;
  }
}
