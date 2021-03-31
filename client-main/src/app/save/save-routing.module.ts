import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaveComponent } from './save.component';

const routes: Routes = [{ path: '', component: SaveComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaveRoutingModule { }
