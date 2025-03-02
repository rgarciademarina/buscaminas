# Buscaminas React

Un juego de Buscaminas moderno desarrollado con React y Tailwind CSS.

## Características

- Interfaz de usuario moderna y atractiva
- Tres niveles de dificultad: Principiante, Intermedio y Experto
- Contador de banderas
- Sistema de puntuaciones guardado en localStorage
- Soporte para tema claro/oscuro
- Diseño responsivo para dispositivos de escritorio

## Requisitos previos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)

## Instalación

1. Clona este repositorio:
   ```
   git clone https://github.com/TU_USUARIO/buscaminas.git
   cd buscaminas
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

## Ejecución del proyecto

Hay dos formas de ejecutar el proyecto:

### 1. Versión con React Router (Completa)

```
npm run dev
```

Esta versión utiliza React Router y tiene todas las características completas del juego.

### 2. Versión Estática (Simplificada)

```
npm run dev:static
```

Esta versión es más ligera y está optimizada para el despliegue en GitHub Pages.

## Construcción para producción

### Versión con React Router

```
npm run build
```

### Versión Estática

```
npm run build:static
```

Los archivos de la versión estática se generarán en la carpeta `dist`.

## Vista previa de la versión estática

```
npm run preview:static
```

## Despliegue

El proyecto está configurado para desplegarse automáticamente en GitHub Pages cuando se hace push a la rama `main`.

La versión desplegada está disponible en: https://rgarciademarina.github.io/buscaminas/

## Estructura del proyecto

- `app/`: Contiene el código fuente de la aplicación
  - `components/`: Componentes de React
  - `static.tsx`: Punto de entrada para la versión estática
- `public/`: Archivos estáticos
- `vite.config.ts`: Configuración de Vite
- `index-static.html`: HTML para la versión estática
- `dev.html`: HTML para desarrollo local de la versión estática

## Cómo jugar

- **Clic izquierdo**: Revelar una celda
- **Clic derecho**: Colocar/quitar una bandera
- Selecciona el nivel de dificultad con los botones superiores
- Inicia un nuevo juego con el botón "Nuevo Juego"

## Tecnologías utilizadas

- React 19
- React Router 7
- Tailwind CSS 4
- TypeScript

## Licencia

MIT
