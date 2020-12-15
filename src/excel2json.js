var xlsx = require('xlsx');

const getKeys = (fileName, sheetName) => {
    
    const workbook = xlsx.readFile(fileName, {sheetRows: 11}),
    abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    row = 11,
    keys = [];

    let desired_value,
    colIndex = 0,
    secondRound = false;

    do {
        
        let target_cell = abc[colIndex] + row;

        target_cell = secondRound ? 'A' + target_cell : target_cell;

        let worksheet = workbook.Sheets[sheetName];
        let desired_cell = worksheet[target_cell];
        
        desired_value = (desired_cell ? desired_cell.v : undefined);

        if(desired_cell) {
            keys.push(desired_value);
        }
            
        colIndex++;

        if(colIndex >= abc.length) {
            secondRound = true;
            colIndex = 0;
        }

    } while(desired_value);
    
    return keys;
}

module.exports = (fileName, sheetName) => {
    const keys = getKeys(fileName, sheetName);
    const workbook = xlsx.readFile(fileName),
    abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let desired_value,
    secondRound = false,
    offset = 0;

    let jsonObject = [];

    let worksheet = workbook.Sheets[sheetName];
    let rowIndex = 12;

    while (worksheet['A' + rowIndex]) {
        let jsonRow = {};
        
        for(let colIndex = 0; colIndex < keys.length; colIndex++) {

            if(colIndex == abc.length) {
                secondRound = true;
                offset = abc.length;
            }

            let target_cell = abc[colIndex - offset] + rowIndex;
    
            target_cell = secondRound ? 'A' + target_cell : target_cell;
    
            let desired_cell = worksheet[target_cell];
            
            desired_value = (desired_cell ? desired_cell.v : null);
    
            jsonRow = {...jsonRow, [keys[colIndex]] : desired_value};
    
        }
        
        jsonObject.push(jsonRow);
        offset = 0;
        secondRound = false;
        rowIndex++;
    }
    
    return jsonObject;
}
