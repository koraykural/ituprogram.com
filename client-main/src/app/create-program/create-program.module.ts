import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateProgramRoutingModule } from './create-program-routing.module';
import { HomeComponent } from './home/home.component';
import { WeekTableComponent } from './week-table/week-table.component';
import { ClassPoolComponent } from './class-pool/class-pool.component';
import { ConvertCommaPipe } from './convert-comma.pipe';


@NgModule({
  declarations: [HomeComponent, WeekTableComponent, ClassPoolComponent, ConvertCommaPipe],
  imports: [
    CommonModule,
    CreateProgramRoutingModule
  ]
})
export class CreateProgramModule { }
