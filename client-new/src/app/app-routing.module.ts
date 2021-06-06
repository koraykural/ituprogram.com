import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'quick',
    loadChildren: () =>
      import('./quick-program/quick-program.module').then(
        (m) => m.QuickProgramModule
      ),
  },
  {
    path: 'archive',
    loadChildren: () =>
      import('./archive/archive.module').then((m) => m.ArchiveModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
