# Malla Parser
Script que me permite extraer de Datos del Excel de Horario de la Facultad y convertir en formato JSON.

## Algoritmo
1. Utilizando Web Scraping obtenemos el enlace de descarga del excel de los horarios de la pagina https://www.pol.una.py/academico/horarios-de-clases-y-examenes/
2. Descargamos el excel en la carpeta public 
3. Convertimos el excel en un formato JSON. 


## Dependencias
    
    "cheerio": "^1.0.0-rc.3" //Permite realizar web scraping
    "request-promise": "^4.2.6", //Realizar una peticion a la pagina
    "xlsx": "^0.16.9" //Para extraer la informacion del excel y convertie en JSON