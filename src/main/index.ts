import { app, BrowserWindow, OnHeadersReceivedListenerDetails, ipcMain } from 'electron';

require('dotenv').config();

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const createWindow = (): void => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    mainWindow.webContents.session.webRequest.onHeadersReceived(
        (details: OnHeadersReceivedListenerDetails, callback) => {
            const responseHeaders = {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    "default-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                        "connect-src 'self' https://generativelanguage.googleapis.com https://emojihub.yurace.pro; " +
                        "style-src 'self' 'unsafe-inline'",
                ],
            } as Record<string, string | string[]>;

            callback({
                responseHeaders,
            });
        }
    );

    // Disable menu bar
    mainWindow.setMenuBarVisibility(false);
    
    if (MAIN_WINDOW_WEBPACK_ENTRY) {
        mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});