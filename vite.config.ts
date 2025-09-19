// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: '/OAuth_Test_Front/',
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/OAuth_Test_Front/',
  build: {
    outDir: 'dist',
    // Добавьте эту настройку для корректной работы с хэш-роутингом
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})