# Asistente de Operaciones TransVIP

Este es un proyecto [Next.js](https://nextjs.org/) desarrollado para asistir en las operaciones de TransVIP, construido con tecnologías modernas y enfocado en la eficiencia operativa.

## Tecnologías Principales

- **Framework**: Next.js 14
- **Lenguaje**: TypeScript/JavaScript
- **Estilizado**: Tailwind CSS
- **Base de Datos**: Supabase
- **Autenticación**: Sistema personalizado con Jose/JWT
- **UI Components**: Radix UI
- **Estado Global**: Zustand
- **Formularios**: React Hook Form + Zod
- **Otros**: SWR, Framer Motion, React DnD

## Inicio Rápido

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo de variables de entorno:
```bash
cp .env.example .env.local
```

4. Configura las variables de entorno en `.env.local`

5. Inicia el servidor de desarrollo:
```bash
npm run dev
```

6. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Estructura del Proyecto

- `/app` - Rutas y páginas de la aplicación
- `/components` - Componentes reutilizables
- `/hooks` - Custom hooks de React
- `/lib` - Utilidades y configuraciones
- `/public` - Archivos estáticos
- `/types` - Definiciones de tipos TypeScript
- `/utils` - Funciones auxiliares
- `/messages` - Internacionalización
- `/supabase` - Configuración y tipos de Supabase

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta el linter

## Características Principales

- 🔐 Autenticación segura
- 📱 Diseño responsivo
- 🎨 Interfaz moderna y accesible
- 🔄 Actualizaciones en tiempo real
- 📦 Gestión eficiente del estado
- 🌐 Soporte para internacionalización

## Despliegue

La aplicación está optimizada para ser desplegada en [Vercel](https://vercel.com), aunque puede ser desplegada en cualquier plataforma que soporte Next.js.

## Contribución

1. Crea un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado y de uso exclusivo para TransVIP.
