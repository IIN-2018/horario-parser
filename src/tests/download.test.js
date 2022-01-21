const { downloadHorarioExcel } = require("../api/download");
const fs = require("fs");

describe.skip('Descargar el Excel del Link de Descarga de la Pagina de la Poli', () => {
    test('Descargar el Excel en la carpeta public', async () => {
        let url = await downloadHorarioExcel("https://www.pol.una.py/academico/horarios-de-clases-y-examenes/", "./public/horario.xlsx");
        let excelExists = fs.existsSync("./public/horario.xlsx");
        expect(excelExists).toBe(true);
    });
});
