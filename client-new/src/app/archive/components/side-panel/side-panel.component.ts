import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { filter, map, pluck, startWith, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { codes } from './codes';
import { terms } from './terms';
import { headers, TableHeader } from '../../table-headers';
import { BehaviorSubject } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

interface Term {
  value: string;
  name: string;
}

interface Selection {
  term: string;
  code: string;
}

const requireMatch = (values: string[]): ValidatorFn => {
  return (control) => {
    const inputValue: string = control.value;
    if (!values.includes(inputValue)) {
      return { incorrect: true };
    }
    return null;
  };
};

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
})
export class SidePanelComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  @Output() drawerClose = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<Selection>();
  @Output() headersChange = new EventEmitter<TableHeader[]>();
  @Output() filterChange = new EventEmitter<string>();

  isBigScreen$ = this.breakpointObserver
    .observe('(min-width: 820px)')
    .pipe(pluck('matches'));

  terms: Term[] = terms;
  codes: string[] = codes;

  f = new FormGroup({
    term: new FormControl(null, requireMatch(terms.map((term) => term.name))),
    code: new FormControl(null, requireMatch(codes)),
  });

  filteredTerms$ = this.f.controls.term.valueChanges.pipe(
    startWith(''),
    filter((value) => value !== null),
    map<string, string>((value) => value.toLocaleLowerCase('tr')),
    map((value) =>
      this.terms.filter((term) =>
        term.name.toLocaleLowerCase('tr').includes(value)
      )
    )
  );
  filteredCodes$ = this.f.controls.code.valueChanges.pipe(
    startWith(''),
    filter((value) => value !== null),
    map<string, string>((value) => value.toLocaleLowerCase('tr')),
    map((value) =>
      this.codes.filter((code) => code.toLocaleLowerCase('tr').includes(value))
    )
  );
  visibleHeaders$ = new BehaviorSubject<TableHeader[]>([...headers]);
  headersList$ = this.visibleHeaders$.pipe(
    tap((visibleHeaders) => {
      this.headersChange.emit(visibleHeaders);
    }),
    map((visibleHeaders) =>
      headers.map((header) => ({
        ...header,
        selected: visibleHeaders.includes(header),
      }))
    )
  );

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.subs.sink = this.f.valueChanges
      .pipe(
        filter(() => this.f.valid),
        map(({ term, code }: Selection) => ({
          term: this.terms.find((termObj) => termObj.name === term) as Term,
          code,
        })),
        map(({ term, code }) => ({ term: term.value, code }))
      )
      .subscribe((selection) => {
        this.selectionChange.emit(selection);
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  visibleHeadersChange(header: TableHeader & { selected: boolean }): void {
    const visibleHeaders = this.visibleHeaders$.value;
    const nextHeaders: TableHeader[] = [];
    const index = visibleHeaders.findIndex(
      (h) => h.identifier === header.identifier
    );
    if (index >= 0) {
      visibleHeaders.splice(index, 1);
    } else {
      visibleHeaders.push(header);
    }
    headers.forEach((h) => {
      if (
        visibleHeaders.findIndex((vh) => vh.identifier === h.identifier) >= 0
      ) {
        nextHeaders.push(h);
      }
    });
    this.visibleHeaders$.next(nextHeaders);
  }

  filterInput(e: any): void {
    this.filterChange.emit(e.target.value || '');
  }
}
