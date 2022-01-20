const { downloadHorarioExcel } = require('./api/download.js');
const { scrapper } = require('./api/scrapper.js');
const { parseExcel } = require('./api/excel2json.js');
const parameters = require('../config/parameters.js');

const completeScrapper = async () => {
    scrapper(parameters.url)
        .then(link => {
            downloadHorarioExcel(link, parameters.pathname)
                .then(() => {
                    const { carreras, horarios } = await parseExcel();
                    return {
                        carreras,
                        horarios
                    }
                })
                .catch(err => {
                    console.log('Download Error: ', err);
                    return null;
                });
        }).catch(err => {
            console.log('Scraping Error: ', err);
            return null;
        });
}

module.exports = {
    completeScrapper
}
