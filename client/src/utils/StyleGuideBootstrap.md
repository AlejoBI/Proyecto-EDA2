# Clases de Bootstrap

Este documento proporciona una lista de las clases más comunes y útiles en Bootstrap, junto con una breve explicación de cada una.

## Sistema de Rejilla (Grid System)

- **`container`**: Proporciona un contenedor fijo o fluido que alinea y ajusta el contenido según el ancho del dispositivo. Hay variantes como `container-fluid` que ocupa el 100% del ancho disponible.
- **`row`**: Crea una fila dentro de un contenedor de rejilla. Se utiliza para agrupar columnas.
- **`col`**: Define una columna en la rejilla. Puede ser específico para distintos tamaños de pantalla, como `col-sm-4`, `col-md-6`, etc.
- **`col-{breakpoint}-{size}`**: Permite especificar el tamaño de la columna en función del tamaño de la pantalla. Ejemplo: `col-md-6` para una columna que ocupa 6 de las 12 unidades disponibles en pantallas medianas.

## Diseño Flexbox

- **`d-flex`**: Aplica `display: flex;` al contenedor.
- **`flex-row` / `flex-column`**: Define la dirección de los elementos flexibles (fila o columna).
- **`align-items-{alignment}`**: Alinea los elementos en el eje transversal (ejemplo: `align-items-center`, `align-items-start`, `align-items-end`).
- **`justify-content-{alignment}`**: Alinea los elementos en el eje principal (ejemplo: `justify-content-center`, `justify-content-between`, `justify-content-around`).
- **`flex-{direction}`**: Controla la dirección del contenido (ejemplo: `flex-row-reverse`, `flex-column-reverse`).

## Tipografía y Texto

- **`text-center`**: Centra el texto dentro de un contenedor.
- **`text-left`**: Alinea el texto a la izquierda.
- **`text-right`**: Alinea el texto a la derecha.
- **`text-uppercase`**: Convierte el texto a mayúsculas.
- **`text-lowercase`**: Convierte el texto a minúsculas.
- **`text-capitalize`**: Capitaliza la primera letra de cada palabra en el texto.

## Colores y Fondos

- **`bg-{color}`**: Define el color de fondo del elemento. Ejemplos: `bg-primary`, `bg-secondary`, `bg-success`.
- **`text-{color}`**: Define el color del texto. Ejemplos: `text-primary`, `text-muted`, `text-danger`.

## Espaciado y Tamaño

- **`m-{size}` / `p-{size}`**: Aplica márgenes o relleno (padding) de tamaño específico. Ejemplos: `m-3`, `p-2`.
- **`mt-{size}` / `mb-{size}` / `ml-{size}` / `mr-{size}`**: Aplica márgenes en una dirección específica (top, bottom, left, right).
- **`pt-{size}` / `pb-{size}` / `pl-{size}` / `pr-{size}`**: Aplica relleno en una dirección específica (top, bottom, left, right).

## Visibilidad

- **`d-none`**: Oculta el elemento.
- **`d-{breakpoint}-none`**: Oculta el elemento en un breakpoint específico (ejemplo: `d-md-none` oculta en pantallas medianas y más grandes).
- **`d-{breakpoint}-block`**: Muestra el elemento como un bloque en un breakpoint específico (ejemplo: `d-lg-block` muestra el elemento como bloque en pantallas grandes).

## Bordes

- **`border`**: Aplica un borde sólido alrededor del elemento.
- **`border-{color}`**: Define el color del borde. Ejemplos: `border-primary`, `border-danger`.
- **`border-{size}`**: Define el grosor del borde. Ejemplos: `border-2`, `border-3`.

## Tamaños

- **`w-{size}` / `h-{size}`**: Define el ancho y alto del elemento. Ejemplos: `w-25` (25% del contenedor), `h-50` (50% del contenedor).
- **`w-auto` / `h-auto`**: Permite que el ancho y alto del elemento se ajusten automáticamente al contenido.

## Utilidades Adicionales

- **`rounded`**: Aplica bordes redondeados al elemento.
- **`shadow`**: Aplica una sombra al elemento.
- **`position-{value}`**: Controla la posición del elemento. Ejemplos: `position-relative`, `position-absolute`.