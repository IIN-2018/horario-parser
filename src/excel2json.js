var xlsx = require('xlsx');

const columnsExcel = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const getHeaders = (fileName, sheetName) => {

    const workbook = xlsx.readFile(fileName, { sheetRows: 11, }),
        initialRowData = 11,
        keys = [];

    let desired_value,
        colIndex = 0,
        secondRound = false;

    do {

        let target_cell = columnsExcel[colIndex] + initialRowData;

        target_cell = secondRound ? 'A' + target_cell : target_cell;

        let worksheet = workbook.Sheets[sheetName];
        let desired_cell = worksheet[target_cell];

        desired_value = (desired_cell ? desired_cell.v : undefined);

        if (desired_cell) keys.push(desired_value);

        colIndex++;

        if (colIndex >= columnsExcel.length) {
            secondRound = true;
            colIndex = 0;
        }

    } while (desired_value);

    return keys;
}

const formatFieldHora = (horaString) => {
    let partes = horaString.trim().split(':');
    return parseInt(partes[0]) * 60 + parseInt(partes[1]);
}

const formatFieldDia = (value) => {
    let fechaString = value.split(' ')[1];
    let partes = fechaString.split("/");
    let dateObject = new Date(`20${partes[2]}`, partes[1] - 1, partes[0]);
    return dateObject.valueOf();
}

const formatFieldDiaSemana = (value) => {
    let newLineIndex = value.indexOf('\r');
    let firstLine = (newLineIndex > 0) ? value.slice(0, newLineIndex + 1) : value;
    let partes = firstLine.trim().split('-');
    return {
        hora_inicio: formatFieldHora(partes[0].trim()),
        hora_fin: formatFieldHora(partes[1].trim())
    }
}

module.exports = (fileName, sheetName) => {
    const headers = getHeaders(fileName, sheetName);
    const workbook = xlsx.readFile(fileName);

    let desired_value,
        secondRound = false,
        offset = 0;

    let jsonObject = [];

    let worksheet = workbook.Sheets[sheetName];
    let rowIndex = 12;

    while (worksheet['A' + rowIndex]) {
        let jsonRow = {};
        let contador = {
            dia: 1,
            hora: 1,
        };

        for (let colIndex = 0; colIndex < headers.length; colIndex++) {

            if (colIndex == columnsExcel.length) {
                secondRound = true;
                offset = columnsExcel.length;
            }

            let target_cell = columnsExcel[colIndex - offset] + rowIndex;

            target_cell = secondRound ? 'A' + target_cell : target_cell;

            let desired_cell = worksheet[target_cell];

            desired_value = (desired_cell ? desired_cell.w : null);


            let field = headers[colIndex];

            if (desired_value) {
                switch (field) {
                    case "Día":
                        desired_value = formatFieldDia(desired_value);
                        field = `Día${contador.dia++}`;
                        break;
                    case "Hora":
                        desired_value = formatFieldHora(desired_value);
                        field = `Hora${contador.hora++}`;
                        break;
                    case "Enfasis":
                        desired_value = ((desired_value === "-- --") ? null : desired_value);
                        break;
                }

                if (diasSemana.includes(field)) desired_value = formatFieldDiaSemana(desired_value);

                if (contador['dia'] === 5) contador['dia'] = 1;
                if (contador['hora'] === 5) contador['hora'] = 1;
            }

            jsonRow = { ...jsonRow, [field]: desired_value };

        }

        jsonObject.push(jsonRow);
        offset = 0;
        secondRound = false;
        rowIndex++;
    }

    return jsonObject;
}
