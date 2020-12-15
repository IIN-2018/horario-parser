const downloadFile = require('./src/download.js');
const getLink = require('./src/scrapper.js');
const excel2json = require('./src/excel2json.js');
const parameters = require('./config/parameters.js');

getLink(parameters.url)
.then(link => {
    downloadFile(link, parameters.pathname)
    .then(() => {
        console.log(excel2json(parameters.pathname, parameters.sheets.IAE));
    });
});

