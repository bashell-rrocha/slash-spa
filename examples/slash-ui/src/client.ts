import { registerServiceWorker } from "@_bashell/slash-ui/host";
import { mountSite } from "./app";

// Entrada do cliente do site de exemplo. __HASH__: build de file:// (Capacitor/Tauri), sem service worker.
const root = document.getElementById("app");
if (!root) throw new Error('site de exemplo: falta o <div id="app"> no index.html');
mountSite(root, { hash: __HASH__ });
if (!__HASH__) registerServiceWorker("/app/sw.js", "/app/");
