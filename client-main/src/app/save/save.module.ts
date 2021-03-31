import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaveRoutingModule } from './save-routing.module';
import { SaveComponent } from './save.component';


@NgModule({
  declarations: [SaveComponent],
  imports: [
    CommonModule,
    SaveRoutingModule
  ]
})
export class SaveModule { }
