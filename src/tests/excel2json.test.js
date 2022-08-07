const { parseExcel, convertHeaderToKey } = require("../api/excel2json")
const fs = require("fs");

describe('Parsear el Excel del Horario a Json', () => {
    test('Verificar que exista el excel', async () => {
        let excelExists = fs.existsSync("./public/horario.xlsx");
        expect(excelExists).toBe(true);
    });

    // test('Parsear el excel', async () => {

    //     let data = convertHeaderToKey('public/horario.xlsx', 'IIN');

    //     expect(data).toEqual({
    //         carreras: [],
    //         horarios: [],
    //     });



    // })

});


