import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./shared/components";

import { HomeRoutingModule } from "./home/home-routing.module";
import { ProgramRoutingModule } from "./program/program-routing.module";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "program",
    redirectTo: "program",
  },
  {
    path: "**",
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HomeRoutingModule,
    ProgramRoutingModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
