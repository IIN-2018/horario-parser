const { parseExcel } = require("../api/excel2json")
const fs = require("fs");

describe('Parsear el Excel del Horario a Json', () => {
    test('Verificar que exista el excel', async () => {
        let excelExists = fs.existsSync("./public/horario.xlsx");
        expect(excelExists).toBe(true);
    });

    // test('Parsear el excel', async () => {
    //     expect(async () => {

    //         let data = await parseExcel()
    //         expect(data).toEqual({
    //             carreras: [],
    //             horarios: [],
    //         });

    //     }).toThrow(Error);

    // })

});


