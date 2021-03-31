import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";

import { HomeComponent } from "./home.component";
import { SharedModule } from "../shared/shared.module";
import { CardComponent } from "./card/card.component";
import { ArchiveComponent } from "./archive/archive.component";
import { TableComponent } from "./archive/table/table.component";
import { SelectorComponent } from "./archive/selector/selector.component";
import { PersonalComponent } from "./personal/personal.component";
import { PlanSelectorComponent } from "./personal/plan-selector/plan-selector.component";
import { PlanTableComponent } from "./personal/plan-table/plan-table.component";
import { AverageComponent } from "./personal/average/average.component";
import { ReactiveFormsModule } from "@angular/forms";
import { OptionalComponent } from "./personal/plan-table/optional/optional.component";
import { OptGroupComponent } from './personal/plan-table/opt-group/opt-group.component';

@NgModule({
  declarations: [
    HomeComponent,
    CardComponent,
    ArchiveComponent,
    TableComponent,
    SelectorComponent,
    PersonalComponent,
    PlanSelectorComponent,
    PlanTableComponent,
    AverageComponent,
    OptionalComponent,
    OptGroupComponent,
  ],
  imports: [CommonModule, SharedModule, HomeRoutingModule, ReactiveFormsModule],
})
export class HomeModule {}
