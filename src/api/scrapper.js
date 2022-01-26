const cheerio = require('cheerio');
const { default: axios } = require('axios');
const https = require('https');

const getHtmlPoli = async (url) => {
    try {
        const options = {
            headers: {
                'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            rejectUnauthorized: false,
        };
        const html = await axios(url, {
            headers:{
                'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
        return cheerio.load(html.data);
    } catch (error) {
        throw new Error(`Error al obtener el html de la pagina: ${url}\n${error}`);
    }
}

const getUrlDescargaHorarioClases = async ($) => {
    try {

        //Seccion de html en la que se encuentra el horario
        const horarioSecciones = $('.elementor.elementor-1100')
            .children()
            .children()
            .last();

        //Seccion de html en la que se encuentra el titulo del horario
        const tituloSeccionHorarioPlaificacion = horarioSecciones
            .children()
            .children()
            .children()
            .children()
            .children()
            .text()
            .trim()
            .replace('Grado', 'Grado - ');

        //Seccion de html en la que se encuentra el enlace de descarga del horario
        const urlHorarioDescarga = horarioSecciones
            .children()
            .children()
            .children()
            .children()
            .children()
            .children('p')
            .children()
            .attr('href');

        console.log(tituloSeccionHorarioPlaificacion, '\n', 'Se ha Conseguido exitosamente el enlace de Descarga: ', urlHorarioDescarga);
        return urlHorarioDescarga;
    } catch (error) {
        throw new Error(`Error al obtener el enlace de descarga del horario de clases: ${error}`);
    }
}

//Verificar en el archivo index.js:
const scrapper = async (url) => {
    try {
        const $ = await getHtmlPoli(url);
        const urlHorarioDescarga = await getUrlDescargaHorarioClases($);
        return urlHorarioDescarga;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = {
    scrapper
}
