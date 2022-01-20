const { downloadHorarioExcel } = require('./api/download.js');
const { scrapper } = require('./api/scrapper.js');
const { parseExcel } = require('./api/excel2json.js');
const parameters = require('../config/parameters.js');

const completeScrapper = () => {
    scrapper(parameters.url)
        .then(link => {
            downloadHorarioExcel(link, parameters.pathname)
                .then(() => {
                    parseExcel();
                })
                .catch(err => {
                    console.log('Download Error: ', err);
                });
        }).catch(err => {
            console.log('Scraping Error: ', err);
        });
}

module.exports = {
    completeScrapper
}
