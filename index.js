const downloadFile = require('./src/download.js');
const getLink = require('./src/scrapper.js');
const excel2json = require('./src/excel2json.js');
const parameters = require('./config/parameters.js');
const fs = require('fs');


(() => {
    getLink(parameters.url)
        .then(link => {
            downloadFile(link, parameters.pathname)
                .then(() => {
                    const data = excel2json(parameters.pathname, parameters.sheets.IIN);
                    const jsonData = JSON.stringify(data);
                    fs.writeFileSync('horario.json', jsonData);
                })
                .catch(err => {
                    console.log('Download Error: ', err);
                });
        }).catch(err=>{
            console.log('Scraping Error: ',err);
        });

})();

