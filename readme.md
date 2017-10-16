# KGroup Auth Api

## Descripción

Servicio encargado de llevar el control de servicios, usuarios y a accesos a distintos servicios internos en Karma Pulse.

## Documentación

Documentación Técnica: En desarrollo
API: En desarrollo

## Tecnologías

- NodeJS >= 7.9
		google-auth-library >= 0.10.0
        koa >= 2.3.0
        koa-jwt >= 3.2.2
        mongoose >= 4.11.10
- MongoDB

## Servicios requeridos

### Servicios internos

### Otros servicios
- MongoDB: Base de datos donde se encuentra la collección de datasets

## Uso

### Configuración previa

- Instalación de dependencias

```
$ npm install
```

- Configuración de App en la consola de Google Developers

Visita [Google Developers Cosole](https://console.developers.google.com) y crea una nuevo proyecto y asignale las credenciales *ID de cliente OAuth*.

### Instalación

- Crear archivo de variables de ambiente con el archivo de ejemplo provisto dentro de la carpeta principal *config* de la aplicación.

```
$ cp -f config/example.env config/production_variables.env
```

- Modifica el archivo **production_variables.env** creado previamente sustituyendo las keys por las necesarias de acuerdo al estilo [RFC 822](https://tools.ietf.org/html/rfc822.html).

#### Variables

- NODE_ENV: Ambiente de ejecución del proyecto (development o production)
- APP_NAME: Nombre de la aplicación
- APP_URL: Url de la aplicación
- PORT: Puerto en el que es servida la aplicación
- LOGGER_LEVEL: Nivel de escritura del logger (default = info)

- MONGODB_URI: URI de la base de datos
- MONGODB_USER: Usuario
- MONGODB_PASSWORD: Password
- MONGODB_DEBUG: Hablita el debug de las acciones en Mongo (default = false)

- GOOGLE_CLIENT_ID: Cliente Id del proyecto en Google Developers
- GOOGLE_CLIENT_SECRET: Client Secret del proyecto de Google Developers
- GOOGLE_REDIRECT_URL: Ruta del Callback configurado en el proyecto de Google Developers
- AUTH_VALID_DOMAIN: Dominios válidos para autenticación separados por pipe (default = karmapulse.com|kamikaze.com)
- APP_TOKEN_PUBLIC: Token público identificador para la aplicación
- APP_TOKEN_SECRET: Token secreto para la aplicación


### Ejecución

- Ejecutar la aplicación.

#### Desarrollo

```
$ npm run develop config/development_variables.env
```

- Si el archivo de configuración tiene otro nombre o ubicación.

```
$ npm run develop [ruta del archivo de configuración]
```

#### Producción

```
$ node index.js config/production_variables.env
```

- Si el archivo de configuración tiene otro nombre o ubicación.

```
$ node index.js [ruta del archivo de configuración]
```
