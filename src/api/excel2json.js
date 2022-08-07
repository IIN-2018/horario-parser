const { find } = require('cheerio/lib/api/traversing.js');
var xlsx = require('xlsx');

const parameters = require('../../config/parameters.js');

const columnsExcel = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];


const convertHeaderToKey = (fileName, sheetName) => {

  const workbook = getExcel(fileName);

  // Como los datos inicia en la fila 11
  const initialRowData = 11;

  // Claves de nuestro JSON
  const keys = [];

  let desiredValue,
    colIndex = 0,
    isCellAtColumnZ = false;

  // Recorremos las columnas para leer los encabezados hasta encontrar una columna vacia
  // La columna vacia se detecta cuando el desiredValue es undefined
  do {

    // Colocamos la celda del excel
    // Ejemplo A0 - A1 - B1
    let currentCell = columnsExcel[colIndex] + initialRowData;

    // Usamos el isCellAtColumnZ para solo usar las columnas del A - Z
    // Ya que en el excel sigue AA - AB - etc
    // La cual nosotros solo queremos de A - Z 
    currentCell = isCellAtColumnZ ? 'A' + currentCell : currentCell;

    let worksheet = getSheet(workbook, sheetName);

    // De la hoja obtenemos por ejemplo A1
    let desiredCell = worksheet[currentCell];

    //Cargamos el valor de la celda en caso de que exista con desiredCell.v 
    desiredValue = (desiredCell ? desiredCell.v : undefined);

    // Agregamos el valor en caaso de que haya
    if (desiredCell) keys.push(desiredValue);

    colIndex++;

    // Detectamos cuando llegamos a la columna Z, y debe empezar por AA, AB, etc
    if (colIndex >= columnsExcel.length) {
      isCellAtColumnZ = true;
      colIndex = 0;
    }

  } while (desiredValue);

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
  if (value === ' ') return null;

  let newLineIndex = value.indexOf('\r');
  let firstLine = (newLineIndex > 0) ? value.slice(0, newLineIndex + 1) : value;

  let partes = firstLine.trim().split('-');

  return {
    hora_inicio: formatFieldHora(partes[0].trim()),
    hora_fin: formatFieldHora(partes[1].trim())
  }
}

const convertExcel2Json = (fileName, sheetName) => {
  const headers = convertHeaderToKey(fileName, sheetName);
  const workbook = xlsx.readFile(fileName);

  let desiredValue,
    isCellAtColumnZ = false,
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
        isCellAtColumnZ = true;
        offset = columnsExcel.length;
      }

      let currentCell = columnsExcel[colIndex - offset] + rowIndex;

      currentCell = isCellAtColumnZ ? 'A' + currentCell : currentCell;

      let desiredCell = worksheet[currentCell];

      desiredValue = (desiredCell ? desiredCell.w : null);


      let field = headers[colIndex];

      if (desiredValue) {
        switch (field) {
          case "Item":
            field = `Id`;
            desiredValue = Number(desiredValue);
            break;
          case "Sem/Grupo":
            field = `Semestre`;
            desiredValue = Number(desiredValue);
            break;
          case "Día":
            desiredValue = formatFieldDia(desiredValue);
            field = `Dia${contador.dia++}`;
            break;
          case "Hora":
            desiredValue = formatFieldHora(desiredValue);
            field = `Hora${contador.hora++}`;
            break;
          case "Enfasis":
            desiredValue = ((desiredValue === "-- --") ? null : desiredValue.split(','));
            break;
          case "Nivel":
            desiredValue = ((desiredValue === "---") ? null : desiredValue);
            break;


        }

        if (diasSemana.includes(field)) desiredValue = formatFieldDiaSemana(desiredValue);

        if (contador['dia'] === 5) contador['dia'] = 1;
        if (contador['hora'] === 5) contador['hora'] = 1;
      }

      field = removeAccents(field);

      if (field.split(" ").length > 1) {
        field = field.replace(new RegExp(' ', 'g'), '_');
      }

      if (field === "DPTO.") {
        field = `departamento`;
      }


      if (field === "Tit") {
        field = `titulo`;
      }


      jsonRow = { ...jsonRow, [field.toLowerCase()]: desiredValue };

    }
    jsonObject.push(jsonRow);
    offset = 0;
    isCellAtColumnZ = false;
    rowIndex++;
  }

  return jsonObject;
}

const parseExcel = async () => {
  try {
    //Cargar todos los horarios de las carreras en un solo JSON recorriendo cada sheet de excel
    let carrerasHorarios = [];
    //Cargar las carreras en formato json
    let carreras = [];

    //Recorrer todos los sheets del excel
    for (let index = 0; index < parameters.sheets.length; index++) {
      const sheet = parameters.sheets[index];
      const data = convertExcel2Json(parameters.pathname, sheet);

      const siglaCarrera = data[0].sigla_carrera;
      const enfasisCarerra = data[0].enfasis;

      //Cargamos la Carrera
      carreras.push({
        nombre: parameters.carreras[siglaCarrera],
        siglas: siglaCarrera,
        enfasis: ((!enfasisCarerra) ? null : enfasisCarerra)
      })
      console.log(`Cargado Exitosamente la carrera de ${siglaCarrera}`);

      //Cargamos el Horario de la Carrera
      carrerasHorarios.push({
        carrera: siglaCarrera,
        horario: data
      });
    }

    //Si la carrera tiene mas de una enfasis, 
    //Se crea una nueva carrera por cada enfasis
    const carrerasConMasDeUnEnfasis = carreras.filter(carrera => {
      return carrera.enfasis != null && carrera.enfasis.length > 1;
    });

    carreras = carreras.filter(carrera => {
      return carrera.enfasis == null || carrera.enfasis.length == 1;
    });

    const nuevasCarreras = [];
    for (const carrera of carrerasConMasDeUnEnfasis) {
      carrera.enfasis.forEach(enfasis => {
        nuevasCarreras.push({
          nombre: carrera.nombre,
          siglas: carrera.siglas,
          enfasis: enfasis
        });
      });
    }

    return {
      carreras: [...carreras, ...nuevasCarreras],
      horarios: carrerasHorarios
    }

  } catch (error) {
    console.log(error);
    throw new Error(`Error al parsear el archivo excel: ${error}`);
  }
}


module.exports = {
  parseExcel
}

function getSheet(workbook, sheetName) {
  return workbook.Sheets[sheetName];
}

function getExcel(fileName) {
  return xlsx.readFile(fileName, { sheetRows: 11 });
}

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 