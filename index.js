const downloadFile = require('./src/download.js');
const getLink = require('./src/scrapper.js');
const excel2json = require('./src/excel2json.js');
const parameters = require('./config/parameters.js');
const fs = require('fs');
var xlsx = require('xlsx');

const getCarrera = (sigla) => {
    switch (sigla) {
        case "IAE":
            return "Ingenieria Aeronautica";
        case "ICM":
            return "Ingenieria en Ciencias de los Materiales";
        case "IEK":
            return "Ingenieria en Electronica";
        case "IEL":
            return "Ingenieria en Electricidad";
        case "IEN":
            return "Ingenieria en Energia";
        case "IIN":
            return "Ingenieria en Informatica";
        case "IMK":
            return "Ingenieria en Marketing";
        case "ISP":
            return "Ingenieria en Sistemas de Produccion";
        case "LCA":
            return "Licenciatura en Ciencias Atmosferica";
        case "LCI":
            return "Licenciatura en Ciencias de la Informacion";
        case "LCIk":
            return "Licenciatura en Ciencias Informaticas";
        case "LEL":
            return "Licenciatura en Electricidad";
        case "LGH":
            return "Licenciatura en Gestion de la Hospitalidad";
        case "TSE":
            return "Tecnico Superior en Electronica";

    };
}

(() => {
    getLink(parameters.url)
        .then(link => {
            downloadFile(link, parameters.pathname)
                .then(() => {
                    const file = xlsx.readFile(parameters.pathname);
                    //Cargar todos los horarios de las carreras en un solo JSON recorriendo cada sheet de excel
                    const carrerasHorarios = [];
                    //Cargar las carreras en formato json
                    const carreras = [];
                    const siglasCarreras = [
                        "IAE",
                        "ICM",
                        "IEK",
                        "IEL",
                        "IEN",
                        "IIN",
                        "IMK",
                        "ISP",
                        "LCA",
                        "LCI",
                        "LCIk",
                        "LEL",
                        "LGH",
                        "TSE"
                    ];

                    for (let index = 0; index < siglasCarreras.length; index++) {

                        const sheet = siglasCarreras[index];
                        const data = excel2json(parameters.pathname, sheet);
                        
                        const siglaCarrera = data[0].Sigla_Carrera;
                        const enfasisCarerra = data[0].Enfasis;
                        console.log(`Cargado Exitosamente la carrera de ${siglaCarrera}`);
                        carreras.push({
                            nombre: getCarrera(siglaCarrera),
                            siglas: siglaCarrera,
                            enfasis: ((!enfasisCarerra) ? null : enfasisCarerra)
                        })
                        carrerasHorarios.push({
                            carrera: siglaCarrera,
                            horario: data
                        });
                    }

                    const jsonData = JSON.stringify(carrerasHorarios);
                    fs.writeFileSync(`horario.json`, jsonData);

                    const jsonDataCarreras = JSON.stringify(carreras);
                    fs.writeFileSync(`carreras.json`, jsonDataCarreras);
                })
                .catch(err => {
                    console.log('Download Error: ', err);
                });
        }).catch(err => {
            console.log('Scraping Error: ', err);
        });

})();

