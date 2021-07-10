const requestPromise = require('request-promise');
const cheerio = require('cheerio')

module.exports = async (url) => {
    try {
        let HTML = await requestPromise(url, {
            headers: {
                'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(HTML);

        const horarioSecciones = $('.elementor.elementor-1100').children().children().last();
        const tituloSeccionHorarioPlaificacion = horarioSecciones.children().children().children().children().children().text().trim().replace('Grado', 'Grado - ');
        const urlHorarioDescarga = horarioSecciones.children().children().children().children().children().children('p').children().attr('href');

        console.log(tituloSeccionHorarioPlaificacion, '\n', 'Se ha Conseguido exitosamente el enlace de Descarga: ', urlHorarioDescarga);
        return urlHorarioDescarga;
    } catch (err) {
        console.log(err);
    }
}