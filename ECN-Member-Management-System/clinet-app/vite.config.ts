//  FOR azure CHECK UP

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// export default defineConfig({
//   base: '/',
//   plugins: [react()],
//   build: {
//     outDir: "dist",
//     chunkSizeWarningLimit: 1000
//   }
// })


//  FOR LOCAL CHECK UP
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert';
// https://vite.dev/config/
export default defineConfig({
  server:{
    port:3000
  },
  plugins: [react(), mkcert()],
})