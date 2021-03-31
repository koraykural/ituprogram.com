import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { PlanService } from "app/state/plan.service";

@Injectable({
  providedIn: "root",
})
export class CanCreateGuard implements CanActivate {
  constructor(private planService: PlanService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.planService.basePlan.value !== null) {
      return true;
    } else {
      this.router.navigateByUrl("/program/cannot-create");
      return false;
    }
  }
}
