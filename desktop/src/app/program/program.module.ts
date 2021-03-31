import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProgramRoutingModule } from "./program-routing.module";
import { PlanComponent } from "./plan/plan.component";
import { SharedModule } from "app/shared/shared.module";
import { SaveComponent } from "./save/save.component";
import { CannotCreateComponent } from "./cannot-create/cannot-create.component";
import { CreateComponent } from "./create/create.component";
import { MenuComponent } from "./plan/menu/menu.component";
import { TableComponent } from "./plan/table/table.component";
import { FiltersComponent } from "./create/filters/filters.component";
import { WeeklyTableComponent } from "./create/weekly-table/weekly-table.component";
import { PoolComponent } from "./create/pool/pool.component";
import { CourseDetailsComponent } from "./create/course-details/course-details.component";

@NgModule({
  declarations: [
    PlanComponent,
    SaveComponent,
    CannotCreateComponent,
    CreateComponent,
    MenuComponent,
    TableComponent,
    FiltersComponent,
    WeeklyTableComponent,
    PoolComponent,
    CourseDetailsComponent,
  ],
  imports: [CommonModule, ProgramRoutingModule, SharedModule],
})
export class ProgramModule {}
