import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PlanComponent } from "./plan/plan.component";
import { SaveComponent } from "./save/save.component";
import { CannotCreateComponent } from "./cannot-create/cannot-create.component";
import { CanCreateGuard } from "./can-create.guard";
import { CreateComponent } from "./create/create.component";

const routes: Routes = [
  {
    path: "program",
    component: PlanComponent,
    canActivate: [CanCreateGuard],
    data: { animation: "right-1" },
  },
  {
    path: "program/cannot-create",
    component: CannotCreateComponent,
    data: { animation: "right-1" },
  },
  {
    path: "program/create",
    component: CreateComponent,
    canActivate: [CanCreateGuard],
    data: { animation: "right-2" },
  },
  {
    path: "program/save",
    component: SaveComponent,
    canActivate: [CanCreateGuard],
    data: { animation: "right-3" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramRoutingModule {}
