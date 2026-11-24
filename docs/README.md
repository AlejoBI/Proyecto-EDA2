# Documentación de Proyecto EDA2

## Propósito

Esta carpeta conserva documentación local para la auditoría y verificación de Proyecto EDA2. En esta fase, la documentación no se publica ni se sincroniza con servicios externos.

## Documentos

- [Requisitos](requirements.md): requisitos descritos por el README del proyecto, con su nivel de certeza y pendientes de validación.
- [Arquitectura](architecture.md): stack y estructura observados, separados de las inferencias y de los aspectos todavía no inspeccionados.
- [Verificación](verification.md): comprobaciones ejecutadas y su resultado (`PASSED`, `FAILED` o `NOT RUN`).

## Convenciones de certeza

- **Hecho observado:** comprobado directamente en un archivo, configuración o salida de comando inspeccionados.
- **Documentado por el proyecto:** declarado en el README u otra documentación; no implica que se haya verificado en ejecución.
- **Inferencia:** interpretación razonable de la estructura o configuración, pendiente de confirmación.
- **Pendiente:** no se ha inspeccionado o verificado todavía.

Los requisitos usan los estados **Documentado**, **Inferido** y **Pendiente de validación**. La verificación registra `PASSED`, `FAILED` o `NOT RUN` para cada comprobación.

## Alcance y mantenimiento

Estos documentos reflejan únicamente el contexto disponible durante la auditoría inicial. Actualizar las afirmaciones cuando exista evidencia nueva, conservando su fuente y estado. No incluir valores de secretos, credenciales ni datos personales.

El repositorio tenía un cambio local preexistente en `client/package-lock.json` durante esta auditoría. Ese cambio no se inspeccionó ni modificó.
