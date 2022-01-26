const cheerio = require('cheerio');
const { default: axios } = require('axios');
const https = require('https');

/**
 * 
 * @param {string} url URL de la pagina de la Poli 
 * @returns Retorna una promesa que al finalizar correctamente retorna el html de la pagina de la Poli
 */
const getHtmlPoli = async (url) => {
    try {
        const options = {
            headers: {
                'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        };
        const html = await axios(url, options);
        return cheerio.load(html.data);
    } catch (error) {
        throw new Error(`Error al obtener el html de la pagina: ${url}\n${error}`);
    }
}

/**
 * 
 * @param {cheerio.CheerioAPI} $ Nos permitira manjear con el DOM de la pagina de la Poli
 * @returns Retorna el URL de descarga del Horario de Clases
 */
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

/**
 * 
 * @param {string} url URL de la pagina de la Poli 2022 - (https://www.pol.una.py/academico/horarios-de-clases-y-examenes/)
 * @returns Retorna una promesa que al finalizar correctamente retorna el enlace de descarga del Horario de Clases
 */
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
