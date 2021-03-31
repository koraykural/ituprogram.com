import { ChangeDetectorRef, Component } from "@angular/core";
import { ElectronService } from "./core/services";
import { TranslateService } from "@ngx-translate/core";
import { AppConfig } from "../environments/environment";
import { BrowserWindow } from "electron";
import { RouterOutlet } from "@angular/router";
import { slideAnimation } from "./shared/route-animations";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  // animations: [slideAnimation],
})
export class AppComponent {
  title = "ituprogram.com";
  isWindows = true;
  win: BrowserWindow;
  isMaximized: boolean;

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private cd: ChangeDetectorRef
  ) {
    this.translate.setDefaultLang("en");
    console.log("AppConfig", AppConfig);

    if (electronService.isElectron) {
      this.isWindows = process.platform === "win32";

      console.log("Run in electron");
      console.log("Electron service", this.electronService);

      this.win = this.electronService.remote.getCurrentWindow();
      this.win.addListener("resize", () => {
        this.isMaximized = this.win.isMaximized();
        this.cd.detectChanges();
      });

      document.addEventListener("keyup", (e) => {
        if (e.code === "F12") {
          this.electronService.remote.getCurrentWebContents().toggleDevTools();
        }
      });
    } else {
      this.win = {
        isMaximized: () => true,
        minimize: () => null,
        maximize: () => null,
        unmaximize: () => null,
        close: () => null,
      } as BrowserWindow;
      console.log("Run in browser");
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData["animation"]
    );
  }
}
