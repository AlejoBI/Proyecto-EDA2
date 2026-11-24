# Arquitectura (captura inicial)

## Estado y alcance

Esta es una descripción inicial basada en el `README.md`, los nombres de archivos y las configuraciones inspeccionadas. No es una revisión completa del código ni una confirmación de comportamiento en ejecución. No se leyeron `client/src/firebase/credentials.js`, archivos `.env` ni valores de secretos.

## Hechos observados

- El repositorio contiene una aplicación cliente bajo `client/`.
- `client/package.json` declara React 18, React DOM 18 y Vite 5, junto con `@vitejs/plugin-react`.
- El código listado está organizado en `src/` con páginas, componentes, contextos, hooks, utilidades y un directorio `firebase/`.
- Hay `client/src/App.jsx` y `client/src/main.jsx` como puntos de entrada nominales; su flujo no se inspeccionó durante esta fase.
- `client/vite.config.js` configura el plugin de React para Vite.
- `client/vercel.json` contiene un rewrite general hacia `/` y cabeceras `Cross-Origin-Opener-Policy: same-origin` y `Cross-Origin-Embedder-Policy: require-corp`.
- `client/package.json` declara scripts `dev`, `build`, `lint` y `preview`. No declara scripts de test, typecheck o formato.
- El README menciona Firebase para base de datos, autenticación y almacenamiento en tiempo real, y Vercel como hosting. Estas son declaraciones documentales.

## Inferencias

- `src/pages`, `src/components`, `src/context`, `src/hooks` y `src/utils` sugieren una organización por tipo de interfaz y responsabilidad de cliente.
- Los contextos `AuthContext`, `JobsContext`, `ChatContext` y `AdminContext` sugieren estado compartido para autenticación, trabajos, chat y administración. No se confirmó su contenido ni sus dependencias.
- La regla rewrite de Vercel parece destinada a permitir navegación directa en una aplicación de una sola página. No se comprobó el comportamiento desplegado.
- El directorio `src/firebase/` sugiere un punto de integración con Firebase. No se concluye qué productos utiliza el código ni cómo se configuran.

## Pendiente de inspección

- Flujo de arranque, enrutamiento y límites entre rutas públicas y protegidas.
- Responsabilidades reales de contextos y hooks y el flujo de datos entre páginas y Firebase.
- Modelo de datos, autorización y manejo de errores.
- Configuración del entorno sin revelar valores sensibles.
- Justificación de las cabeceras COOP/COEP y pruebas locales de compatibilidad.
- Diagrama de componentes o secuencia, que se elaborará solo cuando haya evidencia suficiente.

## Restricciones de la captura

Esta documentación no autoriza ni implica cambios en Firebase, migraciones remotas, despliegues o publicación externa. El cambio local preexistente en `client/package-lock.json` se dejó intacto.
