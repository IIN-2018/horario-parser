const { downloadHorarioExcel } = require('./api/download.js');
const { scrapper } = require('./api/scrapper.js');
const { parseExcel } = require('./api/excel2json.js');
const fs = require('fs');
const parameters = require('../config/parameters.js');

const completeScrapperParser = async () => {
  return scrapper(parameters.url)
    .then(link => {
      return downloadHorarioExcel(link, parameters.pathname)
        .then(async () => {
          const { carreras, horarios } = await parseExcel();
          const myHorario =
          {
            carreras,
            horarios
          };
          createHorarioFile(myHorario);
          return myHorario;
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

//scrapper(parameters.url).then(link => console.log(`Enlace obtenido: ${link}`));
completeScrapperParser();

module.exports = {
  completeScrapperParser,
  scrapper,
}
function createHorarioFile(myHorario) {
  fs.writeFileSync('public/horario.json', JSON.stringify(myHorario));
}

