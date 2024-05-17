import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import gmll from "gmll";
import { AuthenticateWindow } from "./launcher/auth";
import { LaunchMinecraft } from "./launcher/launcher";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    title: "HQLauncher",
    width: 1400,
    height: 750,
    minWidth: 1400,
    minHeight: 750,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.maximize();

  if (isProd) {
    await mainWindow.loadURL("app://./home");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
  }

  // --------------------
  // LAUNCHER STUFF
  // --------------------

  try {
    AuthenticateWindow().then(() => {
      LaunchMinecraft();
    });
  } catch (error) {
    console.error("Launcher init background.ts error:", error);
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("message", async (event, arg) => {
  event.reply("message", `${arg} World!`);
});
