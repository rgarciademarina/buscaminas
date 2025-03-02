import { defineConfig } from 'vite';
import { reactRouter } from 'vite-plugin-react-router';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  base: '/buscaminas/', // Base path for GitHub Pages
  build: {
    rollupOptions: {
      input: {
        main: './app/static.tsx', // Punto de entrada para la versión estática
      },
    },
    outDir: 'dist', // Directorio de salida para la versión estática
  },
});
