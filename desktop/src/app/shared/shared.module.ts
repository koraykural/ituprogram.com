import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { TranslateModule } from "@ngx-translate/core";

import { PageNotFoundComponent, HeaderComponent } from "./components/";
import { WebviewDirective } from "./directives/";
import { FormsModule } from "@angular/forms";
import { ConvertCommaPipe } from "./pipes/convert-comma.pipe";
import { RouterModule } from "@angular/router";

import { NgSelectModule } from "@ng-select/ng-select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from "@angular/material/table";
import { ConvertLineBreakPipe } from "./pipes/convert-line-break.pipe";
import { MatSortModule } from "@angular/material/sort";

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    ConvertCommaPipe,
    HeaderComponent,
    ConvertLineBreakPipe,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    RouterModule,
    MatTooltipModule,
    MatSlideToggleModule,
    NgSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
  ],
  exports: [
    BrowserAnimationsModule,
    TranslateModule,
    WebviewDirective,
    FormsModule,
    ConvertCommaPipe,
    ConvertLineBreakPipe,
    HeaderComponent,
    MatTooltipModule,
    MatSlideToggleModule,
    NgSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
  ],
})
export class SharedModule {}
