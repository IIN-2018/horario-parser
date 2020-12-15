const fs = require('fs');
const http = require('http');
const https = require('https');

module.exports = async function downloadFile(url, filePath) {
    const proto = !url.charAt(4).localeCompare('s') ? https : http;
  
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        let fileInfo = null;

        const callBack = response => {
            if (response.statusCode !== 200) {
                let errmess = `Failed to get '${url}' (${response.statusCode})`;
                if(response.statusCode === 302) {
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

        const request = proto.get(url, callBack);
  
        file
            .on('finish', () => resolve(fileInfo))
            .on('error', errmess => {
                fs.unlink(filePath, () => reject(err));
            });

        request
            .on('error', err => {
                fs.unlink(filePath, () => reject(err));
            })
            .end();
    });
}
