# Requisitos

## Alcance de esta captura

Este documento organiza los requisitos mencionados en el `README.md`. Son **requisitos documentados por el proyecto**, no criterios confirmados con usuarios ni evidencia de que la implementación funcione. No se inspeccionó código para validar su cumplimiento.

## Requisitos funcionales

| ID | Requisito | Fuente | Estado |
|---|---|---|---|
| REQ-F-001 | La plataforma conecta freelancers con empresas que requieren servicios. | `README.md`, descripción | Documentado; pendiente de validación funcional |
| REQ-F-002 | Los usuarios pueden registrarse e iniciar sesión mediante Firebase Authentication. | `README.md`, características y requisitos | Documentado; pendiente de validación funcional |
| REQ-F-003 | La experiencia distingue roles de freelancer y empresa. | `README.md`, características y requisitos | Documentado; reglas y permisos concretos pendientes |
| REQ-F-004 | Las empresas pueden publicar trabajos y los freelancers pueden visualizarlos y postularse. | `README.md`, descripción y características | Documentado; flujo y estados de postulación pendientes |
| REQ-F-005 | Usuarios pueden comunicarse mediante chat en tiempo real. | `README.md`, descripción y características | Documentado; alcance, permisos y comportamiento sin conexión pendientes |
| REQ-F-006 | La aplicación almacena datos usando Firebase. | `README.md`, tecnologías y requisitos | Documentado; productos Firebase y modelo de datos pendientes de confirmar |
| REQ-F-007 | La interfaz toma como referencia una propuesta gráfica en Figma. | `README.md`, requisitos | Documentado; correspondencia visual pendiente de revisión |

## Requisitos de calidad y operación

| ID | Requisito | Fuente | Estado |
|---|---|---|---|
| REQ-NF-001 | La aplicación cliente debe poder compilarse mediante el script Vite declarado en `client/package.json`. | Script `build` observado | Configurado; ejecución pendiente |
| REQ-NF-002 | La aplicación debe admitir rutas de cliente servidas por el hosting previsto. | `client/vercel.json` contiene una regla rewrite; README menciona Vercel | Inferido; comportamiento y necesidad pendientes de validación local |
| REQ-NF-003 | La configuración y documentación no deben exponer secretos. | Restricción de auditoría del usuario | Aplicable a este trabajo; no equivale a una auditoría de secretos del producto |

## Exclusiones de esta auditoría

- No se afirma que los requisitos funcionales estén implementados o aceptados.
- No se inspeccionaron credenciales ni configuración de Firebase.
- No se definieron requisitos de rendimiento, disponibilidad, accesibilidad, retención de datos o seguridad de autorización porque no hay evidencia suficiente para especificarlos.
- No se incluyen cambios de producto, migraciones, despliegues ni publicación de documentación.

## Pendientes de decisión o evidencia

1. Confirmar con responsables y usuarios los flujos y criterios de aceptación de cada requisito funcional.
2. Definir las reglas exactas de roles, permisos, postulaciones y conversación.
3. Identificar y documentar el modelo de datos y los servicios utilizados mediante inspección autorizada, sin divulgar credenciales.
4. Acordar requisitos no funcionales y pruebas de aceptación antes de considerarlos comprometidos.
