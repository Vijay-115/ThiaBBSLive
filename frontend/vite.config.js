import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['swiper'],
  },
  define: {

"process.env": process.env,

},
  server: {
proxy: {
"/api": "http://localhost:5000", // Proxy API to Node backend
},
},
})
