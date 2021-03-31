import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DepartmentSelectorComponent } from "./department-selector/department-selector.component";
import { LoginComponent } from "./login/login.component";
import { IndexComponent } from "./index/index.component";
import { ClassSelectComponent } from "./class-select/class-select.component";
import { IdComponent } from "./id/id.component";
import { UpdateComponent } from "./update/update.component";

const routes: Routes = [
  { path: "", component: IndexComponent },
  { path: "login", component: LoginComponent },
  { path: "update", component: UpdateComponent },
  { path: "department", component: DepartmentSelectorComponent },
  { path: "class-select", component: ClassSelectComponent },
  { path: "id/:id", component: IdComponent },
  {
    path: "create-program",
    loadChildren: () =>
      import("./create-program/create-program.module").then(
        (m) => m.CreateProgramModule
      ),
  },
  {
    path: "save",
    loadChildren: () => import("./save/save.module").then((m) => m.SaveModule),
  },
  {
    path: "save",
    loadChildren: () => import("./save/save.module").then((m) => m.SaveModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
