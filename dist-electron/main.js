"use strict";const e=require("electron");e.app.whenReady().then(()=>{const n=new e.BrowserWindow({title:"HQLauncher",autoHideMenuBar:!0,width:1575,height:855,minWidth:1225,minHeight:775});process.env.VITE_DEV_SERVER_URL&&n.loadURL(process.env.VITE_DEV_SERVER_URL)});
