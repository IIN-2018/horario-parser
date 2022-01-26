const { downloadHorarioExcel } = require('./api/download.js');
const { scrapper } = require('./api/scrapper.js');
const { parseExcel } = require('./api/excel2json.js');
const parameters = require('../config/parameters.js');

const completeScrapperParser = async () => {
    return scrapper(parameters.url)
        .then(link => {
            return downloadHorarioExcel(link, parameters.pathname)
                .then(async () => {
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
    completeScrapperParser,
    scrapper,
}
