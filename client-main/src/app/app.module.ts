import { BrowserModule } from "@angular/platform-browser";
import { LOCALE_ID, NgModule } from "@angular/core";
import "@angular/common/locales/global/tr";
import { ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DepartmentSelectorComponent } from "./department-selector/department-selector.component";
import { IndexComponent } from "./index/index.component";
import { ClassSelectComponent } from "./class-select/class-select.component";
import { ModalComponent } from "./modal/modal.component";
import { FilterService } from "./services/filter.service";
import { HttpClientModule } from "@angular/common/http";
import { LoginComponent } from "./login/login.component";
import { IdComponent } from "./id/id.component";
import { UpdateComponent } from "./update/update.component";

@NgModule({
  declarations: [
    AppComponent,
    DepartmentSelectorComponent,
    LoginComponent,
    IndexComponent,
    ClassSelectComponent,
    ModalComponent,
    LoginComponent,
    IdComponent,
    UpdateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [FilterService, { provide: LOCALE_ID, useValue: "tr" }],
  bootstrap: [AppComponent],
})
export class AppModule {}

// pscp -i "D:\Other Stuff\MongoDB_Database.ppk" -r C:\Users\koray\Desktop\Projects\programmer-frontend\dist\programmer\* ubuntu@ec2-3-127-125-59.eu-central-1.compute.amazonaws.com:/opt/front-end
