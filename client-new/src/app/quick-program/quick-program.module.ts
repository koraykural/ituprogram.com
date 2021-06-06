import { NgModule } from '@angular/core';

import { QuickProgramRoutingModule } from './quick-program-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../shared/shared.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatRippleModule } from '@angular/material/core';

import { PlanSelectComponent } from './components/plan-select/plan-select.component';
import { ClassSelectComponent } from './components/class-select/class-select.component';
import { ProgramSelectComponent } from './components/program-select/program-select.component';
import { PlanGroupTableComponent } from './components/class-select/plan-group-table/plan-group-table.component';
import { SmoothHeightDirective } from './directives/smooth-height.directive';
import { ClassPoolComponent } from './components/class-pool/class-pool.component';
import { ConvertCommaPipe } from './pipes/convert-comma.pipe';
import { WeeklyTableComponent } from './components/weekly-table/weekly-table.component';
import { planReducer } from './state/plan/plan.reducer';
import { planCoursesReducer } from './state/plan-courses/plan-courses.reducer';
import { programReducer } from './state/program/program.reducer';
import { quickProgramKey } from './state/quick-program.state';
import { PlanEffects } from './state/plan/plan.effects';
import { PlanCoursesEffects } from './state/plan-courses/plan-courses.effects';
import { ProgramEffects } from './state/program/program.effects';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { CourseDetailsComponent } from './components/side-panel/course-details/course-details.component';
import { CompleteComponent } from './components/complete/complete.component';

@NgModule({
  declarations: [
    PlanSelectComponent,
    ClassSelectComponent,
    ProgramSelectComponent,
    PlanGroupTableComponent,
    SmoothHeightDirective,
    ClassPoolComponent,
    ConvertCommaPipe,
    WeeklyTableComponent,
    SidePanelComponent,
    CourseDetailsComponent,
    CompleteComponent,
  ],
  imports: [
    SharedModule,
    QuickProgramRoutingModule,
    StoreModule.forFeature(quickProgramKey, {
      plan: planReducer,
      planCourses: planCoursesReducer,
      program: programReducer,
    }),
    EffectsModule.forFeature([PlanEffects, PlanCoursesEffects, ProgramEffects]),
    ClipboardModule,
    MatRippleModule,
  ],
})
export class QuickProgramModule {}
