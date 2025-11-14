import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.API_URL);


console.log('API_URL');
const API_URL = process.env.API_URL ?? 'http://localhost:3000' // ajuste conforme seu back
const FRONT_URL = process.env.VITE_FRONT_URL ?? 'http://localhost:3001' // ajuste conforme seu front
const PORT = process.env.PORT ?? 3000 // ajuste conforme seu front
console.log('passou', FRONT_URL);
// https://vitejs.dev/config/

/*
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
  server: {
    port: 3001,
    strictPort: true,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // seu back Node
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3001,
    strictPort: true,
  },
})

*/

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
  server: {
    port: 3001,
    strictPort: true,
    open: false,
    proxy: {
      '/api': {
        target: API_URL, // seu back Node
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3001,
    strictPort: true,
  },
})