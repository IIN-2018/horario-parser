const fs = require('fs');

function createJson(fileName, data) {
    const jsonData = JSON.stringify(data);
    const jsonFilePath = `public/${fileName}.json`;

    if (fs.existsSync(jsonFilePath)) throw new Error(`The File ${fileName} Already Exists!`);

    fs.writeFile(jsonFilePath, jsonData, (err) => {
        if (err) {
            console.log(err);
        }
        console.log(`El archivo ${fileName}.json ha sido creado exitosamente`);
    });
}




module.exports = {
    createJson
}
