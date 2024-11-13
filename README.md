# Proyecto EDA2 - Plataforma de Freelancers y Empresas

## Descripción del Proyecto

Esta es una plataforma web que conecta freelancers con empresas que necesitan sus servicios. Los freelancers pueden registrarse y postularse a trabajos, mientras que las empresas pueden publicar trabajos y comunicarse directamente con los freelancers interesados. La aplicación incluye un sistema de chat en tiempo real para facilitar la comunicación entre ambas partes.

## Integrantes

- *Ludy Astrid* - 2221008
- *Juan Eduardo Jaramillo* - 2221274
- *Alejandro Bravo* - 2220332

## Tecnologías Utilizadas

- *Frontend*: React
- *Backend*: Firebase (Base de datos, autenticación y almacenamiento en tiempo real)
- *Hosting*: Vercel
- *Diseño*: Figma

## Enlaces Importantes

- *Aplicación en Vercel*: [https://proyecto-eda-2.vercel.app/](https://proyecto-eda-2.vercel.app/)
- *Repositorio en GitHub*: [https://github.com/AlejoBI/Proyecto-EDA2.git](https://github.com/AlejoBI/Proyecto-EDA2.git)
- *Mockup en Figma*: [https://www.figma.com/design/2dY3d9Nc1E3Af6Lkjyo5xZ/Mock-up-Proyecto-EDyA2?node-id=0-1&t=dpQErYGPabWNoqr0-1](https://www.figma.com/design/2dY3d9Nc1E3Af6Lkjyo5xZ/Mock-up-Proyecto-EDyA2?node-id=0-1&t=dpQErYGPabWNoqr0-1)

## Características Principales

- *Registro e inicio de sesión*: Autenticación de usuarios utilizando Firebase.
- *Roles de usuario*: Diferenciación entre freelancers y empresas para personalizar la experiencia.
- *Publicación de trabajos*: Las empresas pueden publicar trabajos que los freelancers pueden visualizar y postularse.
- *Sistema de chat en tiempo real*: Comunicación directa entre freelancers y empresas para discutir detalles de proyectos.
- *Interfaz atractiva y funcional*: Desarrollada a partir del diseño en Figma.

## Estructura de Carpetas

La estructura del proyecto está organizada para asegurar una fácil navegación y mantenimiento del código:

## Requisitos del Proyecto
Este proyecto incluye los siguientes requisitos clave:
1. *Propuesta gráfica* en Figma, que guía la implementación de la UI.
2. *Autenticación*: Implementada con Firebase para registro e inicio de sesión de usuarios.
3. *Roles de usuario*: Diferenciación entre freelancers y empresas, con permisos específicos.
4. *Navegación pública y privada*: Páginas y componentes visibles según el estado de autenticación.
5. *Chat en tiempo real*: Facilita la comunicación directa entre usuarios.
6. *Almacenamiento de datos* en Firebase.

## Instalación y Configuración

1. *Clona el repositorio*:
   ```bash
   git clone https://github.com/AlejoBI/Proyecto-EDA2.git
   cd Proyecto-EDA2/client

2. **Instala las dependencias**:
    ```bash
    npm install

3. *Configura las variables de entorno*: Crea un archivo .env en la carpeta client y agrega las configuraciones de Firebase:

    ```bash
    REACT_APP_API_KEY=your_api_key
    REACT_APP_AUTH_DOMAIN=your_auth_domain
    REACT_APP_PROJECT_ID=your_project_id
    REACT_APP_STORAGE_BUCKET=your_storage_bucket
    REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
    REACT_APP_APP_ID=your_app_id

4. **Inicia el servidor de desarrollo**:
    ```bash
    npm run dev

5. *Accede a la aplicación*: Abre tu navegador y dirígete a http://localhost:5173 para ver la aplicación en funcionamiento.

## Ramas del Proyecto
- *Ludy*
- *Eduardo*
- *Alejandro*

## Créditos
Este proyecto fue desarrollado como parte de un curso de Estructuras de Datos y Algoritmos (EDA). La plataforma busca ser una herramienta útil para conectar freelancers con oportunidades de trabajo de manera efectiva y en tiempo real.