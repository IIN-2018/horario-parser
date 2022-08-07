# Horario Parser 1.0.0

Script que me permite extraer los Datos del Excel de Horario de la Facultad y convertir en formato JSON el Horario y Carreras.

## Algoritmo del completeScrapperParser()

1. Utilizando Web Scraping obtenemos el enlace de descarga del excel de los horarios de la pagina <https://www.pol.una.py/academico/horarios-de-clases-y-examenes/>
2. Descargamos el excel en la carpeta public
3. De la Informacion del excel obtenemos todas las carreras y horarios de las carreras.
4. Retornamos un objeto con una lista de carreras y lista de horarios

Podes correr npm run test para probar las funciones.

## Instalacion

```bash
    npm install @iin-2018/mallaparser
    or
    yarn add @iin-2018/mallaparser
```

## API

completeScrapperParser()
Funcion que realiza ya el scrapping, la descarga y la conversion del excel a json.
Retorna un objeto:
{
    carreras:[],
    horarios:[]
}

### Como usar

```javascript
const { completeScrapperParser } = require('@iin-2018/horario-parser');

completeScrapperParser().then(console.log);
```

Parser(url)
Funcion que recibe la URL de la Pagina de la poli donde esta el link del horario.
Retorna el enlace de la Descarga del Excel.

### Como usar

```javascript
const { scrapper } = require('@iin-2018/horario-parser');

const enlace = 'https://www.pol.una.py/academico/horarios-de-clases-y-examenes/';

scrapper(enlace).then((link) => {
    console.log(link);
});
```

### Dependencias

    "cheerio": "^1.0.0-rc.3" //Permite realizar web scraping
    "axios": "^4.2.6", //Realizar una peticion a la pagina
    "xlsx": "^0.16.9" //Para extraer la informacion del excel y convertir en JSON

### Si tiene algun problema levanten un issue
