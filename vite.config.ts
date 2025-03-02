import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

// Determinar si estamos en modo producción o desarrollo
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [tailwindcss(), tsconfigPaths(), react()],
  base: isProduction ? '/buscaminas/' : '/', // Base path para GitHub Pages en producción, raíz en desarrollo
  build: {
    rollupOptions: {
      input: isProduction ? 'index-static.html' : 'dev.html',
    },
    outDir: 'dist', // Directorio de salida para la versión estática
  },
});
