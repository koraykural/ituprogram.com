import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { selectProgram } from '../state/selectors';
import { map, pluck } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProgramSelectedGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.pipe(
      select(selectProgram),
      pluck('selectedCourses'),
      map((courses) => courses.length > 0),
      map((value) => (value ? true : this.router.parseUrl('/quick/program')))
    );
  }
}
