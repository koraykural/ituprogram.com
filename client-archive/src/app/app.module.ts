import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { ConvertCommaPipe } from "./convert-comma.pipe";
import { HomeComponent } from "./home/home.component";
import { ModalComponent } from "./modal/modal.component";

@NgModule({
  declarations: [AppComponent, ConvertCommaPipe, HomeComponent, ModalComponent],
  imports: [HttpClientModule, BrowserModule.withServerTransition({ appId: 'serverApp' })],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

// pscp -i "D:\Other Stuff\MongoDB_Database.ppk" -r C:\Users\koray\Desktop\Projects\programmer-archive\dist\programmer-archive\* ubuntu@ec2-3-127-125-59.eu-central-1.compute.amazonaws.com:/opt/archive
