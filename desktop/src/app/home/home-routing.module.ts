import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";
import { ArchiveComponent } from "./archive/archive.component";
import { PersonalComponent } from "./personal/personal.component";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    data: { animation: "middle" },
  },
  {
    path: "archive",
    component: ArchiveComponent,
    data: { animation: "right-1" },
  },
  {
    path: "personal",
    component: PersonalComponent,
    data: { animation: "right-1" },
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
