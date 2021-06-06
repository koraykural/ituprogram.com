import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassSelectComponent } from './components/class-select/class-select.component';
import { CompleteComponent } from './components/complete/complete.component';
import { PlanSelectComponent } from './components/plan-select/plan-select.component';
import { ProgramSelectComponent } from './components/program-select/program-select.component';
import { PlanSelectedGuard } from './guards/plan-selected.guard';
import { ProgramSelectedGuard } from './guards/program-selected.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'plan',
  },
  {
    path: 'plan',
    component: PlanSelectComponent,
  },
  {
    path: 'class',
    component: ClassSelectComponent,
    canActivate: [PlanSelectedGuard],
  },
  {
    path: 'program',
    component: ProgramSelectComponent,
    canActivate: [PlanSelectedGuard],
  },
  {
    path: 'complete',
    component: CompleteComponent,
    canActivate: [ProgramSelectedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuickProgramRoutingModule {}
