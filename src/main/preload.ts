import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('env', {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
});