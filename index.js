const downloadFile = require('./src/download.js');
const getLink = require('./src/scrapper.js');
const excel2json = require('./src/excel2json.js');
const parameters = require('./config/parameters.js');
const fs = require('fs');
var xlsx = require('xlsx');


(() => {
    getLink(parameters.url)
        .then(link => {
            downloadFile(link, parameters.pathname)
                .then(() => {
                    //Cargar todos los horarios de las carreras en un solo JSON recorriendo cada sheet de excel
                    const file = xlsx.readFile(parameters.pathname);
                    const carrerasHorarios = [];
                    const sheets = file.SheetNames;
                    for (let index = 1; index < 15; index++) {
                        const sheet = sheets[index];
                        const data = excel2json(parameters.pathname, sheet);

                        console.log(`Cargado Exitosamente la carrera de ${data[0].Sigla_Carrera}`);

                        carrerasHorarios.push({
                            carrera: data[0].Sigla_Carrera,
                            horario: data
                        });
                    }
                    const jsonData = JSON.stringify(carrerasHorarios);
                    fs.writeFileSync(`horario.json`, jsonData);
                    
                    // const data = excel2json(parameters.pathname, parameters.sheets.IIN);
                    // const jsonData = JSON.stringify(data);
                    // fs.writeFileSync('horario.json', jsonData);


                })
                .catch(err => {
                    console.log('Download Error: ', err);
                });
        }).catch(err => {
            console.log('Scraping Error: ', err);
        });

})();

