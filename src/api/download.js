const fs = require('fs');
const http = require('http');
const https = require('https');
const parameters = require('../../config/parameters');

/**
 * 
 * @param {string} url Enlace del Horario de la Poli
 * @param {string} fileDownloadPath Path de donde sera descargado el excel 
 * @returns Promesa que al finalizar correctamente descarga el excel en el path indicado
 */
const downloadHorarioExcel = async (url, fileDownloadPath) => {
    //TODO: Implementar en caso de HTTP (No es urgente)
    //Descomentar si es http
    //const proto = !url.charAt(4).localeCompare('s') ? https : http;

    return new Promise((resolve, reject) => {

        if (!directoryExists()) {
            createFolder();
        }

        const file = fs.createWriteStream(fileDownloadPath);
        let fileInfo = null;

        const callback = response => {
            if (response.statusCode !== 200) {
                let errmess = `Failed to get '${url}' (${response.statusCode})`;
                if (response.statusCode === 302) {
                    errmess = `The resource requested has been temporarily moved to ${response.headers.location} (${response.statusCode})`;
                }
                reject(new Error(errmess));
                return;
            }

            fileInfo = {
                mime: response.headers['content-type'],
                size: parseInt(response.headers['content-length'], 10),
            };

            response.pipe(file);
        };


        let req = https.request(url, {
            rejectUnauthorized: false,
        }, callback);
        req.setHeader('User-Agent', ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        req.end();


        file
            .on('finish', () => resolve(fileInfo))
            .on('error', err => {
                fs.unlink(fileDownloadPath, () => reject(err));
            });

        req
            .on('error', err => {
                fs.unlink(fileDownloadPath, () => reject(err));
            })
            .end();
    });
}

function createFolder() {
  fs.mkdirSync(parameters.directory, {
    mode: 0o777
  });
}

function directoryExists() {
  return fs.existsSync(parameters.directory);
}

module.exports = {
    downloadHorarioExcel,
}