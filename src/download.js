const fs = require('fs');
const http = require('http');
const https = require('https');

const downloadHorarioExcel = async (url, filePath) => {
    //Descomentar si es http
    //const proto = !url.charAt(4).localeCompare('s') ? https : http;

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
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
            .on('error', errmess => {
                fs.unlink(filePath, () => reject(err));
            });

        req
            .on('error', err => {
                fs.unlink(filePath, () => reject(err));
            })
            .end();
    });
}

module.exports = {
    downloadHorarioExcel,
}