# Jelly Brain Board Server

## Descripción

Back-end service para Jelly Brain Board

## Documentación

API: En desarrollo

## Tecnologías

- NodeJS >= 7.9
        koa >= 2.3.0
        mongoose >= 4.11.10
- MongoDB

## Uso

### Configuración previa

- Instalación de dependencias

```
$ npm install
```

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
