const { scrapper } = require("../api/scrapper");

describe.skip('Web Scrapping de la Pagina de la Poli', () => {
    test('Obtener el url de descarga del horario de la pagina de la poli', async () => {
        let url = await scrapper('https://www.pol.una.py/academico/horarios-de-clases-y-examenes/');
        expect(url).toBe("https://www.pol.una.py/wp-content/uploads/2022/01/Planificacion-de-clases-y-examenes-del-Segundo-Periodo-2021-versionweb-18012022.xlsx");
    });
});
