import { app, BrowserWindow, screen, shell } from "electron";
import * as path from "path";
import * as url from "url";

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === "--serve");

function createWindow(): BrowserWindow {
  const electronScreen = screen;

  // Create spinner loader window.
  const loading = new BrowserWindow({
    show: false,
    frame: false,
    width: 1050,
    height: 720,
    minWidth: 1050,
    minHeight: 720,
    backgroundColor: "#edf2f7",
  });

  // Show the spinner
  loading.loadURL(
    url.format({
      pathname: path.join(__dirname, "dist/assets/spinner.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  loading.once("show", () => {
    // Create the browser window.
    win = new BrowserWindow({
      width: 1050,
      height: 720,
      minWidth: 1050,
      minHeight: 720,
      show: false,
      frame: false,
      backgroundColor: "#edf2f7",
      icon: path.join(__dirname, `/dist/assets/icons/favicon.512x512.png`),
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        allowRunningInsecureContent: serve ? true : false,
        enableRemoteModule: true,
        webSecurity: false,
      },
    });

    if (serve) {
      win.webContents.openDevTools();
      require("electron-reload")(__dirname, {
        electron: require(`${__dirname}/node_modules/electron`),
      });
      win.on("ready-to-show", () => {
        setTimeout(() => {
          win.show();
          loading.hide();
          loading.close();
        }, 500);
      });
      win.loadURL("http://localhost:4200");
    } else {
      win.on("ready-to-show", () => {
        setTimeout(() => {
          win.show();
          loading.hide();
          loading.close();
        }, 500);
      });
      win.loadURL(
        url.format({
          pathname: path.join(__dirname, "dist/index.html"),
          protocol: "file:",
          slashes: true,
        })
      );
    }
  });

  loading.show();

  // Open links in default OS browser
  win.webContents.on("new-window", function (e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });

  if (process.platform == "win32") {
    // Remove menu
    win.setMenu(null);
  }

  // Emitted when the window is closed.
  win.on("closed", () => {
    win = null;
  });

  return win;
}

try {
  app.on("ready", () => setTimeout(createWindow, 200));

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {}
