import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { AppState } from 'src/app/state/app.state';
import { selectPlan } from '../state/selectors';

@Injectable({
  providedIn: 'root',
})
export class PlanSelectedGuard implements CanActivate {
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
      select(selectPlan),
      pluck('term'),
      map((term) => term !== null),
      map((value) => (value ? true : this.router.parseUrl('/quick/plan')))
    );
  }
}
