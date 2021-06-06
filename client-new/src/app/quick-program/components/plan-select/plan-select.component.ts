import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Department, Faculty, Term } from 'src/app/interfaces';
import { map, pluck, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import * as planActions from '../../state/plan/plan.actions';
import { AppState } from 'src/app/state/app.state';
import { selectPlan } from '../../state/selectors';

@Component({
  selector: 'app-plan-select',
  templateUrl: './plan-select.component.html',
  styleUrls: ['./plan-select.component.scss'],
})
export class PlanSelectComponent implements OnInit {
  private planState$ = this.store.pipe(
    select(selectPlan),
    tap(({ faculty, department, term }) => {
      this.form.patchValue({ faculty, department, term });
    })
  );
  faculties$: Observable<Faculty[]> = this.planState$.pipe(pluck('faculties'));
  departmentsLoading$: Observable<boolean> = this.planState$.pipe(
    pluck('departmentsLoading')
  );
  departments$: Observable<Department[]> = this.planState$.pipe(
    pluck('departments'),
    tap<Department[]>((departments) => {
      const c = this.form.controls.department;
      departments.length === 0 ? c.disable() : c.enable();
    })
  );
  termsLoading$: Observable<boolean> = this.planState$.pipe(
    pluck('termsLoading')
  );
  terms$: Observable<Term[]> = this.planState$.pipe(
    pluck('terms'),
    tap<Term[]>((terms) => {
      const c = this.form.controls.term;
      terms.length === 0 ? c.disable() : c.enable();
    })
  );
  disableContinue$: Observable<boolean> = this.planState$.pipe(
    pluck('term'),
    map((term) => term === null)
  );

  form = new FormGroup({
    faculty: new FormControl({ value: null, disabled: false }, [
      Validators.required,
    ]),
    department: new FormControl({ value: null, disabled: true }, [
      Validators.required,
    ]),
    term: new FormControl({ value: null, disabled: true }, [
      Validators.required,
    ]),
  });

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}

  facultySelected(faculty: Faculty): void {
    this.store.dispatch(planActions.selectFaculty({ faculty }));
  }

  departmentSelected(department: Department): void {
    this.store.dispatch(planActions.selectDepartment({ department }));
  }

  termSelected(term: Term): void {
    this.store.dispatch(planActions.selectTerm({ term }));
  }
}
