# Horario Parser
Script que me permite extraer los Datos del Excel de Horario de la Facultad y convertir en formato JSON el Horario y Carreras.

## Algoritmo
1. Utilizando Web Scraping obtenemos el enlace de descarga del excel de los horarios de la pagina https://www.pol.una.py/academico/horarios-de-clases-y-examenes/
2. Descargamos el excel en la carpeta public 
3. Convertimos el excel en un formato JSON. 

## Para poder usar ejecutar:
```bash
    npm login --registry=https://npm.pkg.github.com --scope=@iin-2018
```
Luego te va a pedir username, password (Que seria token personal) y correo.

## Instalacion
```bash
    npm install @iin-2018/mallaparser@1.0.0
    or
    yarn add @iin-2018/mallaparser@1.0.0
```
## API
completeScrapper()
Funcion que realiza ya el scrapping, la descarga y la conversion del excel a json.
Tiene que generarte en tu proyecto los JSONs en la carpeta public.

### Dependencias
    "cheerio": "^1.0.0-rc.3" //Permite realizar web scraping
    "request-promise": "^4.2.6", //Realizar una peticion a la pagina
    "xlsx": "^0.16.9" //Para extraer la informacion del excel y convertir en JSON

### Obs:
Tuve problemas para windows