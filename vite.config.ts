// This is like your app's GPS settings
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/quotemoto-quote-form-60/', // 👈🏼 MUST BE YOUR REPO NAME
  build: {
    outDir: 'dist', // Output folder
    emptyOutDir: true, // Clean old files
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js', // JS file storage
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]' // Images/fonts
      }
    }
  }
})
