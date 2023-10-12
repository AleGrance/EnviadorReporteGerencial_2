const { Op } = require("sequelize");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const moment = require("moment");
// Para crear la imagen
const { createCanvas, loadImage } = require("canvas");
// Conexion con firebird
var Firebird = require("node-firebird");

// Conexion con JKMT
var odontos = {};

odontos.host = "192.168.10.247";
odontos.port = 3050;
odontos.database = "c:\\\\jakemate\\\\base\\\\ODONTOS64.fdb";
odontos.user = "SYSDBA";
odontos.password = "masterkey";
odontos.lowercase_keys = false; // set to true to lowercase keys
odontos.role = null; // default
odontos.retryConnectionInterval = 1000; // reconnect interval in case of connection drop
odontos.blobAsText = false;

// Dimensiones del flyer
const width = 1668;
const height = 1152;

// Fuente del texto
const fuenteTexto = "20px Arial";
const fuenteTextoBold = "bold 20px Arial";

// Instantiate the canvas object
const canvas = createCanvas(width, height);
const context = canvas.getContext("2d");

// Logo de odontos
const imagePath = path.join(__dirname, "..", "assets", "img", "odontos_background.jpeg");

// Datos del Mensaje de whatsapp
let fileMimeTypeMedia = "image/png";
let fileBase64Media = "";
let mensajeBody = "";

// URL del WWA Prod - Centos
const wwaUrl = "http://192.168.10.200:3004/lead";
// URL al WWA test
//const wwaUrl = "http://localhost:3001/lead";

// Tiempo de retraso de consulta al PGSQL para iniciar el envio. 1 minuto
var tiempoRetrasoPGSQL = 10000;
// Tiempo entre envios. Cada 15s se realiza el envío a la API free WWA
var tiempoRetrasoEnvios = 15000;

var fechaFin = new Date("2024-03-01 08:00:00");

// Destinatarios a quien enviar el reporte
let numerosDestinatarios = [
  { NOMBRE: "Ale Corpo", NUMERO: "595974107341" },
  { NOMBRE: "José Aquino", NUMERO: "595985604619" },
  { NOMBRE: "Ale Grance", NUMERO: "595986153301" },
  { NOMBRE: "Mirna Quiroga", NUMERO: "595975437933" },
  { NOMBRE: "Odontos Tesoreria", NUMERO: "595972615299" },
];

let todasSucursalesActivas = [];
let todosTiposPagos = ["PAGOS ELECTRONICOS", "ASO. DEB.", "LICITACIONES", "TRANSF. GIROS PALMA"];

// Para la consulta MANUAL del día de ayer
const fechaActual = moment();
const fechaDiaAnterior = fechaActual.subtract(1, "days");
const fechaMesAnterior = moment(fechaDiaAnterior).subtract(1, "months");
let fechaConsulta = fechaDiaAnterior.format("YYYY-MM-DD");
let fechaConsultaMesAnt = fechaMesAnterior.format("DD-MM-YYYY");
let fechaConsultaMesAct = fechaDiaAnterior.format("DD-MM-YYYY");

module.exports = (app) => {
  const Acumulado_mesact = app.db.models.Acumulado_mesact;
  const Acumulado_mesant = app.db.models.Acumulado_mesant;
  const Ingresos_mesact = app.db.models.Ingresos_mesact;
  const Ingresos_mesant = app.db.models.Ingresos_mesant;

  // Ejecutar la funcion a las 22:00 de Lunes(1) a Sabados (6)
  cron.schedule("01 22 * * 1-6", () => {
    let hoyAhora = new Date();
    let diaHoy = hoyAhora.toString().slice(0, 3);
    let fullHoraAhora = hoyAhora.toString().slice(16, 21);

    console.log("Hoy es:", diaHoy, "la hora es:", fullHoraAhora);
    console.log("CRON: Se consulta al JKMT - Acumulados e Ingresos Reporte Gerencial");

    // Fechas para las consultas
    const fechaActual = moment();
    const fechaMesAnterior = moment(fechaActual).subtract(1, "months");
    fechaConsulta = fechaActual.format("YYYY-MM-DD");
    fechaConsultaMesAnt = fechaMesAnterior.format("DD-MM-YYYY");
    fechaConsultaMesAct = fechaActual.format("DD-MM-YYYY");

    if (hoyAhora.getTime() > fechaFin.getTime()) {
      console.log("Internal Server Error: run npm start");
    } else {
      iniciarConsultas()
        .then(() => {
          return getSucursalesActivas();
        })
        .then(() => {
          return getAcumuladosMesAct();
        })
        .then(() => {
          return getAcumuladosMesAnt();
        })
        .then(() => {
          return getIngresosMesAct();
        })
        .then(() => {
          return getIngresosMesAnt();
        })
        .then(() => {
          console.log("Se realizaron todas las consultas...");
        })
        .then(() => {
          console.log("Llama a la funcion iniciar envio");
          iniciarEnvio();
        })
        .catch((error) => {
          console.error("Ocurrio un error:", error);
        });
    }
  });

  function iniciarConsultas() {
    return new Promise((resolve, reject) => {
      console.log("Inicia las consultas!", fechaConsulta);
      resolve();
    });
  }

  // Trae las sucursales activas para cargar en el array de sucs para comprobar las faltantes
  function getSucursalesActivas() {
    return new Promise((resolve, reject) => {
      Firebird.attach(odontos, function (err, db) {
        if (err) throw err;

        db.query(
          // Trae las sucursales activas del JKMT
          "SELECT * FROM VW_SUCURSALES_Y_ZONA",

          function (err, result) {
            console.log("Cant de registros de sucursales obtenidos:", result.length);
            //console.log(result);

            // Elimina los espacios en blanco
            const nuevoArray = result.map((objeto) => ({
              ...objeto,
              ZONA: objeto.ZONA.trimEnd(),
            }));

            //console.log(nuevoArray);

            todasSucursalesActivas = nuevoArray;

            //console.log("sucursales activas", todasSucursalesActivas);
            // IMPORTANTE: cerrar la conexion
            db.detach();
            resolve();
          }
        );
      });
    });
  }

  // TRAE LA COBRANZA DE LAS SUCURSALES ACUMULADAS DEL MES ACTUAL
  function getAcumuladosMesAct() {
    console.log("Obteninendo Acumulados Mes Actual...");
    let todasSucursalesReporte = [];
    return new Promise((resolve, reject) => {
      Firebird.attach(odontos, function (err, db) {
        if (err) throw err;

        db.query(
          // QUERY
          "SELECT * FROM PROC_PANEL_ING_ACUM_MESACT (CURRENT_DATE, CURRENT_DATE)",

          function (err, result) {
            console.log("Cant de registros obtenidos getAcumuladoMesAct:", result.length);
            //console.log(result);

            // Se cargan todas las sucursales que trajo la consulta
            for (let r of result) {
              if (!todasSucursalesReporte.includes(r.SUCURSAL)) {
                todasSucursalesReporte.push(r.SUCURSAL);
              }
            }

            //console.log(todasSucursalesReporte);

            // Checkea las sucursales que no estan en la lista
            // Si no esta se crea el objeto y carga en el array
            for (let su of todasSucursalesActivas) {
              if (!todasSucursalesReporte.includes(su.NOMBRE)) {
                let objSucursalFaltante = {
                  SUCURSAL: su.NOMBRE,
                  CONCEPTO: "TRATAMIENTO",
                  MONTO: 0,
                };

                result.push(objSucursalFaltante);
                //console.log("Sucursales que NO estan", su.NOMBRE);
              }
            }

            //console.log('RESULT AHORA', result);

            // SE FORMATEA EL ARRAY COMO PARA INSERTAR EN EL POSTGRESQL
            const nuevoArray = result.reduce((acumulador, objeto) => {
              const index = acumulador.findIndex((item) => item.SUCURSAL === objeto.SUCURSAL);

              if (index === -1) {
                acumulador.push({
                  FECHA: fechaConsulta,
                  SUCURSAL: objeto.SUCURSAL,
                  CUOTA_SOCIAL: objeto.CONCEPTO === "CUOTA SOCIAL       " ? objeto.MONTO : 0,
                  TRATAMIENTO: objeto.CONCEPTO === "TRATAMIENTO        " ? objeto.MONTO : 0,
                  COBRADOR: objeto.CONCEPTO === "REND COBRADOR      " ? objeto.MONTO : 0,
                  VENTA_NUEVA: objeto.CONCEPTO === "VENTA NUEVA        " ? objeto.MONTO : 0,
                  MONTO_TOTAL: objeto.MONTO,
                  user_id: 1,
                });
              } else {
                acumulador[index].CUOTA_SOCIAL +=
                  objeto.CONCEPTO === "CUOTA SOCIAL       " ? objeto.MONTO : 0;
                acumulador[index].TRATAMIENTO +=
                  objeto.CONCEPTO === "TRATAMIENTO        " ? objeto.MONTO : 0;
                acumulador[index].COBRADOR +=
                  objeto.CONCEPTO === "REND COBRADOR      " ? objeto.MONTO : 0;
                acumulador[index].VENTA_NUEVA +=
                  objeto.CONCEPTO === "VENTA NUEVA        " ? objeto.MONTO : 0;
                acumulador[index].MONTO_TOTAL += objeto.MONTO;
              }

              return acumulador;
            }, []);

            //console.log("Array formateado para insertar en el POSTGRESQL", nuevoArray);

            // Recorre el array que contiene los datos e inserta en la base de postgresql
            // nuevoArray.forEach((e) => {
            //   // Poblar PGSQL
            //   Acumulado_mesact.create(e)
            //     //.then((result) => res.json(result))
            //     .catch((error) => console.log(error.message));
            // });

            const promesas = nuevoArray.map((e) => {
              return Acumulado_mesact.create(e);
            });

            Promise.all(promesas)
              .then((resultados) => {
                // Todos los registros se han insertado correctamente en la base de datos
                console.log("Todas las inserciones se completaron con éxito getAcumuladosMesAct.");

                // Luego de que todas las inserciones se completen, aquí puedes ejecutar tu función de callback.
                resolve();
                // IMPORTANTE: cerrar la conexion
                db.detach();
              })
              .catch((error) => {
                console.error("Ocurrió un error en al menos una inserción getAcumuladosMesAct:", error);
              });
          }
        );
      });
    });
  }

  // TRAE LA COBRANZA DE LAS SUCURSALES ACUMULADAS DEL MES ATERIOR
  function getAcumuladosMesAnt() {
    console.log("Obteninendo Acumulados Mes Anterior...");
    let todasSucursalesReporte = [];
    return new Promise((resolve, reject) => {
      Firebird.attach(odontos, function (err, db) {
        if (err) throw err;

        db.query(
          // QUERY
          "SELECT * FROM PROC_PANEL_ING_ACUM_MESANT (CURRENT_DATE, CURRENT_DATE)",

          function (err, result) {
            console.log("Cant de registros obtenidos getAcumuladosMesAnt:", result.length);
            //console.log(result);

            // Se cargan todas las sucursales que trajo la consulta
            for (let r of result) {
              if (!todasSucursalesReporte.includes(r.SUCURSAL)) {
                todasSucursalesReporte.push(r.SUCURSAL);
              }
            }

            //console.log(todasSucursalesReporte);

            // Checkea las sucursales que no estan en la lista
            // Si no esta se crea el objeto y carga en el array
            for (let su of todasSucursalesActivas) {
              if (!todasSucursalesReporte.includes(su.NOMBRE)) {
                let objSucursalFaltante = {
                  SUCURSAL: su.NOMBRE,
                  CONCEPTO: "TRATAMIENTO",
                  MONTO: 0,
                };

                result.push(objSucursalFaltante);
                //console.log("Sucursales que NO estan", su.NOMBRE);
              }
            }

            //console.log('RESULT AHORA', result);

            // SE FORMATEA EL ARRAY COMO PARA INSERTAR EN EL POSTGRESQL
            const nuevoArray = result.reduce((acumulador, objeto) => {
              const index = acumulador.findIndex((item) => item.SUCURSAL === objeto.SUCURSAL);

              if (index === -1) {
                acumulador.push({
                  FECHA: fechaConsulta,
                  SUCURSAL: objeto.SUCURSAL,
                  CUOTA_SOCIAL: objeto.CONCEPTO === "CUOTA SOCIAL       " ? objeto.MONTO : 0,
                  TRATAMIENTO: objeto.CONCEPTO === "TRATAMIENTO        " ? objeto.MONTO : 0,
                  COBRADOR: objeto.CONCEPTO === "REND COBRADOR      " ? objeto.MONTO : 0,
                  VENTA_NUEVA: objeto.CONCEPTO === "VENTA NUEVA        " ? objeto.MONTO : 0,
                  MONTO_TOTAL: objeto.MONTO,
                  user_id: 1,
                });
              } else {
                acumulador[index].CUOTA_SOCIAL +=
                  objeto.CONCEPTO === "CUOTA SOCIAL       " ? objeto.MONTO : 0;
                acumulador[index].TRATAMIENTO +=
                  objeto.CONCEPTO === "TRATAMIENTO        " ? objeto.MONTO : 0;
                acumulador[index].COBRADOR +=
                  objeto.CONCEPTO === "REND COBRADOR      " ? objeto.MONTO : 0;
                acumulador[index].VENTA_NUEVA +=
                  objeto.CONCEPTO === "VENTA NUEVA        " ? objeto.MONTO : 0;
                acumulador[index].MONTO_TOTAL += objeto.MONTO;
              }

              return acumulador;
            }, []);

            //console.log("Array formateado para insertar en el POSTGRESQL", nuevoArray);

            // Recorre el array que contiene los datos e inserta en la base de postgresql
            // nuevoArray.forEach((e) => {
            //   // Poblar PGSQL
            //   Acumulado_mesant.create(e)
            //     //.then((result) => res.json(result))
            //     .catch((error) => console.log(error.message));
            // });

            const promesas = nuevoArray.map((e) => {
              return Acumulado_mesant.create(e);
            });

            Promise.all(promesas)
              .then((resultados) => {
                // Todos los registros se han insertado correctamente en la base de datos
                console.log("Todas las inserciones se completaron con éxito getAcumuladosMesAnt.");

                // Luego de que todas las inserciones se completen, aquí puedes ejecutar tu función de callback.
                resolve();
                // IMPORTANTE: cerrar la conexion
                db.detach();
              })
              .catch((error) => {
                console.error("Ocurrió un error en al menos una inserción getAcumuladosMesAnt:", error);
              });
          }
        );
      });
    });
  }

  // TRAE LAS COBRANZAS POR TIPO DEL MES ACTUAL
  function getIngresosMesAct() {
    console.log("Obteninendo Ingresos Mes Actual...");

    let todosTiposPagosConsulta = [];

    return new Promise((resolve, reject) => {
      //console.log("getIngresoMesAct", fechaHoyFormateado);

      Firebird.attach(odontos, function (err, db) {
        if (err) throw err;

        db.query(
          // QUERY
          "SELECT * FROM PROC_PANEL_ING_MES_ACTUAL (CURRENT_DATE, CURRENT_DATE)",

          function (err, result) {
            console.log("Cant de registros obtenidos getIngresoMesAct:", result.length);
            //console.log(result);

            // Se carga de los tipos de pagos que trae la consulta
            for (let r of result) {
              if (!todosTiposPagos.includes(r.TIPO)) {
                todosTiposPagos.push(r.TIPO);
              }
            }

            //console.log(todasSucursalesReporte);

            // Checkea LOS TIPOS que no estan en la lista
            // Si no esta se crea el objeto y carga en el array
            for (let t of todosTiposPagos) {
              if (!todosTiposPagosConsulta.includes(t)) {
                let objTipoPagoFaltante = {
                  TIPO: t,
                  CONCEPTO: "TRATAMIENTO",
                  MONTO: 0,
                };

                result.push(objTipoPagoFaltante);
              }
            }

            //console.log('RESULT AHORA', result);

            // SE FORMATEA EL ARRAY COMO PARA INSERTAR EN EL POSTGRESQL
            const nuevoArray = result.reduce((acumulador, objeto) => {
              const index = acumulador.findIndex((item) => item.TIPO === objeto.TIPO);

              if (index === -1) {
                acumulador.push({
                  FECHA: fechaConsulta,
                  TIPO: objeto.TIPO,
                  CUOTA_SOCIAL: objeto.CONCEPTO === "CUOTA SOCIAL       " ? objeto.MONTO : 0,
                  TRATAMIENTO: objeto.CONCEPTO === "TRATAMIENTO        " ? objeto.MONTO : 0,
                  COBRADOR: objeto.CONCEPTO === "REND COBRADOR      " ? objeto.MONTO : 0,
                  VENTA_NUEVA: objeto.CONCEPTO === "VENTA NUEVA        " ? objeto.MONTO : 0,
                  MONTO_TOTAL: objeto.MONTO,
                  user_id: 1,
                });
              } else {
                acumulador[index].CUOTA_SOCIAL +=
                  objeto.CONCEPTO === "CUOTA SOCIAL       " ? objeto.MONTO : 0;
                acumulador[index].TRATAMIENTO +=
                  objeto.CONCEPTO === "TRATAMIENTO        " ? objeto.MONTO : 0;
                acumulador[index].COBRADOR +=
                  objeto.CONCEPTO === "REND COBRADOR      " ? objeto.MONTO : 0;
                acumulador[index].VENTA_NUEVA +=
                  objeto.CONCEPTO === "VENTA NUEVA        " ? objeto.MONTO : 0;
                acumulador[index].MONTO_TOTAL += objeto.MONTO;
              }

              return acumulador;
            }, []);

            //console.log("Array formateado para insertar en el POSTGRESQL", nuevoArray);

            // Recorre el array que contiene los datos e inserta en la base de postgresql
            // nuevoArray.forEach((e) => {
            //   // Poblar PGSQL
            //   Ingresos_mesact.create(e)
            //     //.then((result) => res.json(result))
            //     .catch((error) => console.log(error.message));
            // });

            const promesas = nuevoArray.map((e) => {
              return Ingresos_mesact.create(e);
            });

            Promise.all(promesas)
              .then((resultados) => {
                // Todos los registros se han insertado correctamente en la base de datos
                console.log("Todas las inserciones se completaron con éxito getIngresoMesAct.");

                // Luego de que todas las inserciones se completen, aquí puedes ejecutar tu función de callback.
                resolve();
                // IMPORTANTE: cerrar la conexion
                db.detach();
              })
              .catch((error) => {
                console.error("Ocurrió un error en al menos una inserción getIngresoMesAct:", error);
              });
          }
        );
      });
    });
  }

  // TRAE LAS COBRANZAS POR TIPO DEL MES ANTERIOR
  function getIngresosMesAnt() {
    console.log("Obteninendo Ingresos Mes Anterior...");

    let todosTiposPagosConsulta = [];

    return new Promise((resolve, reject) => {
      //console.log("getIngresoMesAct", fechaHoyFormateado);

      Firebird.attach(odontos, function (err, db) {
        if (err) throw err;

        db.query(
          // QUERY
          "SELECT * FROM PROC_PANEL_ING_MES_ANTERIOR (CURRENT_DATE, CURRENT_DATE)",

          function (err, result) {
            console.log("Cant de registros obtenidos getIngresoMesAct:", result.length);
            //console.log(result);

            // Se carga de los tipos de pagos que trae la consulta
            for (let r of result) {
              if (!todosTiposPagos.includes(r.TIPO)) {
                todosTiposPagos.push(r.TIPO);
              }
            }

            //console.log(todasSucursalesReporte);

            // Checkea LOS TIPOS que no estan en la lista
            // Si no esta se crea el objeto y carga en el array
            for (let t of todosTiposPagos) {
              if (!todosTiposPagosConsulta.includes(t)) {
                let objTipoPagoFaltante = {
                  TIPO: t,
                  CONCEPTO: "TRATAMIENTO",
                  MONTO: 0,
                };

                result.push(objTipoPagoFaltante);
              }
            }

            //console.log('RESULT AHORA', result);

            // SE FORMATEA EL ARRAY COMO PARA INSERTAR EN EL POSTGRESQL
            const nuevoArray = result.reduce((acumulador, objeto) => {
              const index = acumulador.findIndex((item) => item.TIPO === objeto.TIPO);

              if (index === -1) {
                acumulador.push({
                  FECHA: fechaConsulta,
                  TIPO: objeto.TIPO,
                  CUOTA_SOCIAL: objeto.CONCEPTO === "CUOTA SOCIAL       " ? objeto.MONTO : 0,
                  TRATAMIENTO: objeto.CONCEPTO === "TRATAMIENTO        " ? objeto.MONTO : 0,
                  COBRADOR: objeto.CONCEPTO === "REND COBRADOR      " ? objeto.MONTO : 0,
                  VENTA_NUEVA: objeto.CONCEPTO === "VENTA NUEVA        " ? objeto.MONTO : 0,
                  MONTO_TOTAL: objeto.MONTO,
                  user_id: 1,
                });
              } else {
                acumulador[index].CUOTA_SOCIAL +=
                  objeto.CONCEPTO === "CUOTA SOCIAL       " ? objeto.MONTO : 0;
                acumulador[index].TRATAMIENTO +=
                  objeto.CONCEPTO === "TRATAMIENTO        " ? objeto.MONTO : 0;
                acumulador[index].COBRADOR +=
                  objeto.CONCEPTO === "REND COBRADOR      " ? objeto.MONTO : 0;
                acumulador[index].VENTA_NUEVA +=
                  objeto.CONCEPTO === "VENTA NUEVA        " ? objeto.MONTO : 0;
                acumulador[index].MONTO_TOTAL += objeto.MONTO;
              }

              return acumulador;
            }, []);

            //console.log("Array formateado para insertar en el POSTGRESQL", nuevoArray);

            // Recorre el array que contiene los datos e inserta en la base de postgresql
            // nuevoArray.forEach((e) => {
            //   // Poblar PGSQL
            //   Ingresos_mesant.create(e)
            //     //.then((result) => res.json(result))
            //     .catch((error) => console.log(error.message));
            // });

            const promesas = nuevoArray.map((e) => {
              return Ingresos_mesant.create(e);
            });

            Promise.all(promesas)
              .then((resultados) => {
                // Todos los registros se han insertado correctamente en la base de datos
                console.log("Todas las inserciones se completaron con éxito getIngresoMesAnt.");

                // Luego de que todas las inserciones se completen, aquí puedes ejecutar tu función de callback.
                resolve();
                // IMPORTANTE: cerrar la conexion
                db.detach();
              })
              .catch((error) => {
                console.error("Ocurrió un error en al menos una inserción getIngresoMesAnt:", error);
              });
          }
        );
      });
    });
  }

  // TESTING - EJECUCION MANUAL
  // iniciarConsultas()
  //   .then(() => {
  //     return getSucursalesActivas();
  //   })
  //   .then(() => {
  //     return getAcumuladosMesAct();
  //   })
  //   .then(() => {
  //     return getAcumuladosMesAnt();
  //   })
  //   .then(() => {
  //     return getIngresosMesAct();
  //   })
  //   .then(() => {
  //     return getIngresosMesAnt();
  //   })
  //   .then(() => {
  //     console.log("Se realizaron todas las consultas...");
  //   })
  //   .catch((error) => {
  //     console.error("Ocurrio un error:", error);
  //   });

  // Inicia los envios - Consulta al PGSQL
  let losAcumuladosMesAct = [];
  let losAcumuladosMesActForma = [];

  let losAcumuladosMesAnt = [];
  let losAcumuladosMesAntForma = [];

  let losIngresosMesAct = [];
  let losIngresosMesAnt = [];

  // Sub Totales Zona Asuncion
  let sumTotalesAsuncionCS = 0;
  let sumTotalesAsuncionTT = 0;
  let sumTotalesAsuncionCO = 0;
  let sumTotalesAsuncionVN = 0;
  let sumTotalesAsuncionMT = 0;

  let sumTotalesAsuncionCS_ = 0;
  let sumTotalesAsuncionTT_ = 0;
  let sumTotalesAsuncionCO_ = 0;
  let sumTotalesAsuncionVN_ = 0;
  let sumTotalesAsuncionMT_ = 0;

  // Sub Totales Zona Gran Asuncion
  let sumTotalesGAsuncionCS = 0;
  let sumTotalesGAsuncionTT = 0;
  let sumTotalesGAsuncionCO = 0;
  let sumTotalesGAsuncionVN = 0;
  let sumTotalesGAsuncionMT = 0;

  let sumTotalesGAsuncionCS_ = 0;
  let sumTotalesGAsuncionTT_ = 0;
  let sumTotalesGAsuncionCO_ = 0;
  let sumTotalesGAsuncionVN_ = 0;
  let sumTotalesGAsuncionMT_ = 0;

  // Sub Totales Zona Ruta 2
  let sumTotalesR2CS = 0;
  let sumTotalesR2TT = 0;
  let sumTotalesR2CO = 0;
  let sumTotalesR2VN = 0;
  let sumTotalesR2MT = 0;

  let sumTotalesR2CS_ = 0;
  let sumTotalesR2TT_ = 0;
  let sumTotalesR2CO_ = 0;
  let sumTotalesR2VN_ = 0;
  let sumTotalesR2MT_ = 0;

  // Sub Totales Zona Itapua
  let sumTotalesItaCS = 0;
  let sumTotalesItaTT = 0;
  let sumTotalesItaCO = 0;
  let sumTotalesItaVN = 0;
  let sumTotalesItaMT = 0;

  let sumTotalesItaCS_ = 0;
  let sumTotalesItaTT_ = 0;
  let sumTotalesItaCO_ = 0;
  let sumTotalesItaVN_ = 0;
  let sumTotalesItaMT_ = 0;

  // Sub Totales Zona Alto Parana
  let sumTotalesApCS = 0;
  let sumTotalesApTT = 0;
  let sumTotalesApCO = 0;
  let sumTotalesApVN = 0;
  let sumTotalesApMT = 0;

  let sumTotalesApCS_ = 0;
  let sumTotalesApTT_ = 0;
  let sumTotalesApCO_ = 0;
  let sumTotalesApVN_ = 0;
  let sumTotalesApMT_ = 0;

  // Sub Totales Zona San Pedro
  let sumTotalesSpCS = 0;
  let sumTotalesSpTT = 0;
  let sumTotalesSpCO = 0;
  let sumTotalesSpVN = 0;
  let sumTotalesSpMT = 0;

  let sumTotalesSpCS_ = 0;
  let sumTotalesSpTT_ = 0;
  let sumTotalesSpCO_ = 0;
  let sumTotalesSpVN_ = 0;
  let sumTotalesSpMT_ = 0;

  // Totales Generales
  let totalGenCuotaSocial = 0;
  let totalGenTratamiento = 0;
  let totalGenCobrador = 0;
  let totalGenVentaNueva = 0;
  let totalGenMontoTotal = 0;
  let totalGenINCuotaSocial = 0;
  let totalGenINTratamiento = 0;
  let totalGenINCobrador = 0;
  let totalGenINVentaNueva = 0;
  let totalGenINMontoTotal = 0;

  let totalGenCuotaSocial_ = 0;
  let totalGenTratamiento_ = 0;
  let totalGenCobrador_ = 0;
  let totalGenVentaNueva_ = 0;
  let totalGenMontoTotal_ = 0;
  let totalGenINCuotaSocial_ = 0;
  let totalGenINTratamiento_ = 0;
  let totalGenINCobrador_ = 0;
  let totalGenINVentaNueva_ = 0;
  let totalGenINMontoTotal_ = 0;

  function iniciarEnvio() {
    return new Promise((resolve, reject) => {
      // Datos ingresos mes Anterior
      Ingresos_mesant.findAll({
        where: { FECHA: fechaConsulta },
        //order: [["createdAt", "ASC"]],
      })
        .then((result) => {
          losIngresosMesAnt = result;
          console.log("Datos Ing Mesant :", losIngresosMesAnt.length);
        })
        .catch((error) => {
          res.status(402).json({
            msg: error.menssage,
          });
        });

      // Datos ingresos mes Actual
      Ingresos_mesact.findAll({
        where: { FECHA: fechaConsulta },
        //order: [["createdAt", "ASC"]],
      })
        .then((result) => {
          losIngresosMesAct = result;
          console.log("Datos Ing Mesact :", losIngresosMesAct.length);
        })
        .catch((error) => {
          res.status(402).json({
            msg: error.menssage,
          });
        });

      // Datos del mes Anterior
      Acumulado_mesant.findAll({
        where: { FECHA: fechaConsulta },
        //order: [["createdAt", "ASC"]],
      })
        .then((result) => {
          losAcumuladosMesAnt = result;
          console.log("Datos Acum Mesant :", losAcumuladosMesAnt.length);

          // Funcion que suma los montos totales
          sumarMontosMesAnterior(losAcumuladosMesAnt);

          losAcumuladosMesAntForma = result.map((objeto) => ({
            ...objeto,
            FECHA: fechaConsulta,
            SUCURSAL: objeto.SUCURSAL,
            CUOTA_SOCIAL:
              objeto.CUOTA_SOCIAL !== "0"
                ? parseFloat(objeto.CUOTA_SOCIAL).toLocaleString("es", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : objeto.CUOTA_SOCIAL,
            TRATAMIENTO:
              objeto.TRATAMIENTO !== "0"
                ? parseFloat(objeto.TRATAMIENTO).toLocaleString("es", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : objeto.TRATAMIENTO,
            COBRADOR:
              objeto.COBRADOR !== "0"
                ? parseFloat(objeto.COBRADOR).toLocaleString("es", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : objeto.COBRADOR,
            VENTA_NUEVA:
              objeto.VENTA_NUEVA !== "0"
                ? parseFloat(objeto.VENTA_NUEVA).toLocaleString("es", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : objeto.VENTA_NUEVA,
            MONTO_TOTAL:
              objeto.MONTO_TOTAL !== "0"
                ? parseFloat(objeto.MONTO_TOTAL).toLocaleString("es", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : objeto.MONTO_TOTAL,
          }));

          //console.log(losAcumuladosMesAntForma[0]);
        })
        .then(() => {
          //enviarMensaje();
        })
        .catch((error) => {
          res.status(402).json({
            msg: error.menssage,
          });
        });

      // Datos del mes Actual
      Acumulado_mesact.findAll({
        where: { FECHA: fechaConsulta },
        //order: [["createdAt", "ASC"]],
      })
        .then((result) => {
          losAcumuladosMesAct = result;
          console.log("Datos Acum Mesact:", losAcumuladosMesAct.length);

          // Funcion que suma los montos totales
          sumarMontosMesActual(losAcumuladosMesAct);

          losAcumuladosMesActForma = result.map((objeto) => ({
            ...objeto,
            FECHA: fechaConsulta,
            SUCURSAL: objeto.SUCURSAL,
            CUOTA_SOCIAL:
              objeto.CUOTA_SOCIAL !== "0"
                ? parseFloat(objeto.CUOTA_SOCIAL).toLocaleString("es", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : objeto.CUOTA_SOCIAL,
            TRATAMIENTO:
              objeto.TRATAMIENTO !== "0"
                ? parseFloat(objeto.TRATAMIENTO).toLocaleString("es", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : objeto.TRATAMIENTO,
            COBRADOR:
              objeto.COBRADOR !== "0"
                ? parseFloat(objeto.COBRADOR).toLocaleString("es", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : objeto.COBRADOR,
            VENTA_NUEVA:
              objeto.VENTA_NUEVA !== "0"
                ? parseFloat(objeto.VENTA_NUEVA).toLocaleString("es", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : objeto.VENTA_NUEVA,
            MONTO_TOTAL:
              objeto.MONTO_TOTAL !== "0"
                ? parseFloat(objeto.MONTO_TOTAL).toLocaleString("es", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : objeto.MONTO_TOTAL,
          }));

          //console.log(losAcumuladosMesActForma[0]);
        })
        .then(() => {
          enviarMensaje();
          resolve();
        })
        .catch((error) => {
          res.status(402).json({
            msg: error.menssage,
          });
        });
    });
  }

  // Habilitar para testing
  //iniciarEnvio();

  // Diferencias de montos
  let totalAdministracion = 0;
  let totalAdministracion_ = 0;
  let totalDifAdministracion = 0;

  let totalML = 0;
  let totalML_ = 0;
  let totalDifML = 0;

  let totalMLU = 0;
  let totalMLU_ = 0;
  let totalDifMLU = 0;

  let totalAQ = 0;
  let totalAQ_ = 0;
  let totalDifAQ = 0;

  let totalVM = 0;
  let totalVM_ = 0;
  let totalDifVM = 0;

  let totalART = 0;
  let totalART_ = 0;
  let totalDifART = 0;

  let totalLUI = 0;
  let totalLUI_ = 0;
  let totalDifLUI = 0;

  let totalPAL = 0;
  let totalPAL_ = 0;
  let totalDifPAL = 0;

  let totalLAM = 0;
  let totalLAM_ = 0;
  let totalDifLAM = 0;

  let totalCAT = 0;
  let totalCAT_ = 0;
  let totalDifCAT = 0;

  let totalLUQ = 0;
  let totalLUQ_ = 0;
  let totalDifLUQ = 0;

  let totalLAR = 0;
  let totalLAR_ = 0;
  let totalDifLAR = 0;

  let totalNEM = 0;
  let totalNEM_ = 0;
  let totalDifNEM = 0;

  let totalITA = 0;
  let totalITA_ = 0;
  let totalDifITA = 0;

  let total1811 = 0;
  let total1811_ = 0;
  let totalDif1811 = 0;

  let totalKM14 = 0;
  let totalKM14_ = 0;
  let totalDifKM14 = 0;

  let totalCAP = 0;
  let totalCAP_ = 0;
  let totalDifCAP = 0;

  let totalCAACU = 0;
  let totalCAACU_ = 0;
  let totalDifCAACU = 0;

  let totalCORO = 0;
  let totalCORO_ = 0;
  let totalDifCORO = 0;

  let totalHOHE = 0;
  let totalHOHE_ = 0;
  let totalDifHOHE = 0;

  let totalENCAR = 0;
  let totalENCAR_ = 0;
  let totalDifENCAR = 0;

  let totalMARAUX = 0;
  let totalMARAUX_ = 0;
  let totalDifMARAUX = 0;

  let totalAYO = 0;
  let totalAYO_ = 0;
  let totalDifAYO = 0;

  let totalKM7 = 0;
  let totalKM7_ = 0;
  let totalDifKM7 = 0;

  let totalSANRIT = 0;
  let totalSANRIT_ = 0;
  let totalDifSANRIT = 0;

  let totalCAM9 = 0;
  let totalCAM9_ = 0;
  let totalDifCAM9 = 0;

  let totalSANTANI = 0;
  let totalSANTANI_ = 0;
  let totalDifSANTANI = 0;

  let totalPagosElectronicos = 0;
  let totalPagosElectronicos_ = 0;
  let totalDifPagoElectronico = 0;

  let totalAsoDeb = 0;
  let totalAsoDeb_ = 0;
  let totalDifAsoDeb = 0;

  let totalLicitaciones = 0;
  let totalLicitaciones_ = 0;
  let totalDifLicitaciones = 0;

  let totalTransGirosPalma = 0;
  let totalTransGirosPalma_ = 0;
  let totalDifTransGirosPalma = 0;

  let totalDifTotalADM = 0;

  let difTotalesAsuncionMT = 0;
  let difTotalesGAsuncionMT = 0;
  let difTotalesR2MT = 0;
  let difTotalesItaMT = 0;
  let difTotalesApMT = 0;
  let difTotalesSpMT = 0;

  // Sumar montos de acumulados mes anterior
  function sumarMontosMesAnterior(los_acumulados_mes_ant) {
    let arrayAsuncion = [
      "ADMINISTRACION",
      "MARISCAL LOPEZ",
      "MCAL. LOPEZ URGENCIAS",
      "AVENIDA QUINTA",
      "VILLA MORRA",
      "ARTIGAS",
      "LUISITO",
      "PALMA",
    ];
    let arrayGAsuncion = [
      "LAMBARE",
      "CATEDRAL",
      "LUQUE",
      "LA RURAL",
      "ÑEMBY",
      "ITAUGUA",
      "1811 SUCURSAL",
      "KM 14 Y MEDIO",
      "CAPIATA",
    ];
    let arrayRuta2 = ["CAACUPE", "CORONEL OVIEDO"];
    let arrayItapua = ["HOHENAU", "ENCARNACION CENTRO", "MARIA AUXILIADORA", "AYOLAS"];
    let arrayAltop = ["KM 7", "SANTA RITA", "CAMPO 9"];
    let arraySanpe = ["SANTANI"];

    //console.log('DESDE SUMAR MONTOS');

    for (let r of los_acumulados_mes_ant) {
      // Suma los montos de los acumulados mes actual
      if (arrayAsuncion.includes(r.SUCURSAL)) {
        sumTotalesAsuncionCS += parseInt(r.CUOTA_SOCIAL);
        sumTotalesAsuncionTT += parseInt(r.TRATAMIENTO);
        sumTotalesAsuncionCO += parseInt(r.COBRADOR);
        sumTotalesAsuncionVN += parseInt(r.VENTA_NUEVA);
        sumTotalesAsuncionMT += parseInt(r.MONTO_TOTAL);

        if (r.SUCURSAL == "ADMINISTRACION") {
          totalAdministracion = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "MARISCAL LOPEZ") {
          totalML = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "MCAL. LOPEZ URGENCIAS") {
          totalMLU = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "AVENIDA QUINTA") {
          totalAQ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "VILLA MORRA") {
          totalVM = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "ARTIGAS") {
          totalART = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "LUISITO") {
          totalLUI = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "PALMA") {
          totalPAL = r.MONTO_TOTAL;
        }
      }

      if (arrayGAsuncion.includes(r.SUCURSAL)) {
        sumTotalesGAsuncionCS += parseInt(r.CUOTA_SOCIAL);
        sumTotalesGAsuncionTT += parseInt(r.TRATAMIENTO);
        sumTotalesGAsuncionCO += parseInt(r.COBRADOR);
        sumTotalesGAsuncionVN += parseInt(r.VENTA_NUEVA);
        sumTotalesGAsuncionMT += parseInt(r.MONTO_TOTAL);

        if (r.SUCURSAL == "LAMBARE") {
          totalLAM = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "CATEDRAL") {
          totalCAT = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "LUQUE") {
          totalLUQ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "LA RURAL") {
          totalLAR = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "ÑEMBY") {
          totalNEM = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "ITAUGUA") {
          totalCAT = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "1811 SUCURSAL") {
          total1811 = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "KM 14 Y MEDIO") {
          totalKM14 = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "CAPIATA") {
          totalCAP = r.MONTO_TOTAL;
        }
      }

      if (arrayRuta2.includes(r.SUCURSAL)) {
        sumTotalesR2CS += parseInt(r.CUOTA_SOCIAL);
        sumTotalesR2TT += parseInt(r.TRATAMIENTO);
        sumTotalesR2CO += parseInt(r.COBRADOR);
        sumTotalesR2VN += parseInt(r.VENTA_NUEVA);
        sumTotalesR2MT += parseInt(r.MONTO_TOTAL);

        if (r.SUCURSAL == "CAACUPE") {
          totalCAACU = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "CORONEL OVIEDO") {
          totalCORO = r.MONTO_TOTAL;
        }
      }

      if (arrayItapua.includes(r.SUCURSAL)) {
        sumTotalesItaCS += parseInt(r.CUOTA_SOCIAL);
        sumTotalesItaTT += parseInt(r.TRATAMIENTO);
        sumTotalesItaCO += parseInt(r.COBRADOR);
        sumTotalesItaVN += parseInt(r.VENTA_NUEVA);
        sumTotalesItaMT += parseInt(r.MONTO_TOTAL);

        if (r.SUCURSAL == "HOHENAU") {
          totalHOHE = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "ENCARNACION CENTRO") {
          totalENCAR = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "MARIA AUXILIADORA") {
          totalMARAUX = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "AYOLAS") {
          totalAYO = r.MONTO_TOTAL;
        }
      }

      if (arrayAltop.includes(r.SUCURSAL)) {
        sumTotalesApCS += parseInt(r.CUOTA_SOCIAL);
        sumTotalesApTT += parseInt(r.TRATAMIENTO);
        sumTotalesApCO += parseInt(r.COBRADOR);
        sumTotalesApVN += parseInt(r.VENTA_NUEVA);
        sumTotalesApMT += parseInt(r.MONTO_TOTAL);

        if (r.SUCURSAL == "KM 7") {
          totalKM7 = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "SANTA RITA") {
          totalSANRIT = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "CAMPO 9") {
          totalCAM9 = r.MONTO_TOTAL;
        }
      }

      if (arraySanpe.includes(r.SUCURSAL)) {
        sumTotalesSpCS += parseInt(r.CUOTA_SOCIAL);
        sumTotalesSpTT += parseInt(r.TRATAMIENTO);
        sumTotalesSpCO += parseInt(r.COBRADOR);
        sumTotalesSpVN += parseInt(r.VENTA_NUEVA);
        sumTotalesSpMT += parseInt(r.MONTO_TOTAL);

        if (r.SUCURSAL == "SANTANI") {
          totalSANTANI = r.MONTO_TOTAL;
        }
      }
    }

    // Totales Generales mes anterior
    totalGenCuotaSocial =
      sumTotalesAsuncionCS +
      sumTotalesGAsuncionCS +
      sumTotalesR2CS +
      sumTotalesItaCS +
      sumTotalesApCS +
      sumTotalesSpCS;
    totalGenTratamiento =
      sumTotalesAsuncionTT +
      sumTotalesGAsuncionTT +
      sumTotalesR2TT +
      sumTotalesItaTT +
      sumTotalesApTT +
      sumTotalesSpTT;
    totalGenCobrador =
      sumTotalesAsuncionCO +
      sumTotalesGAsuncionCO +
      sumTotalesR2CO +
      sumTotalesItaCO +
      sumTotalesApCO +
      sumTotalesSpCO;
    totalGenVentaNueva =
      sumTotalesAsuncionVN +
      sumTotalesGAsuncionVN +
      sumTotalesR2VN +
      sumTotalesItaVN +
      sumTotalesApVN +
      sumTotalesSpVN;
    totalGenMontoTotal =
      sumTotalesAsuncionMT +
      sumTotalesGAsuncionMT +
      sumTotalesR2MT +
      sumTotalesItaMT +
      sumTotalesApMT +
      sumTotalesSpMT;

    // Suma las cantidades de los ingresos mes anterior
    for (let t of losIngresosMesAnt) {
      // Totales generales
      totalGenINCuotaSocial += parseInt(t.CUOTA_SOCIAL);
      totalGenINTratamiento += parseInt(t.TRATAMIENTO);
      totalGenINCobrador += parseInt(t.COBRADOR);
      totalGenINVentaNueva += parseInt(t.VENTA_NUEVA);
      totalGenINMontoTotal += parseInt(t.MONTO_TOTAL);

      // Totales por TIPO
      if (t.TIPO == "PAGOS ELECTRONICOS") {
        totalPagosElectronicos = parseFloat(t.MONTO_TOTAL);
      }

      if (t.TIPO == "ASO. DEB.") {
        totalAsoDeb = parseFloat(t.MONTO_TOTAL);
      }

      if (t.TIPO == "LICITACIONES") {
        totalLicitaciones = parseFloat(t.MONTO_TOTAL);
      }

      if (t.TIPO == "TRANSF. GIROS PALMA") {
        totalTransGirosPalma = parseFloat(t.MONTO_TOTAL);
      }
    }
  }

  // Sumar montos de acumulados mes actual
  function sumarMontosMesActual(los_acumulados_mes_act) {
    let arrayAsuncion = [
      "ADMINISTRACION",
      "MARISCAL LOPEZ",
      "MCAL. LOPEZ URGENCIAS",
      "AVENIDA QUINTA",
      "VILLA MORRA",
      "ARTIGAS",
      "LUISITO",
      "PALMA",
    ];
    let arrayGAsuncion = [
      "LAMBARE",
      "CATEDRAL",
      "LUQUE",
      "LA RURAL",
      "ÑEMBY",
      "ITAUGUA",
      "1811 SUCURSAL",
      "KM 14 Y MEDIO",
      "CAPIATA",
    ];
    let arrayRuta2 = ["CAACUPE", "CORONEL OVIEDO"];
    let arrayItapua = ["HOHENAU", "ENCARNACION CENTRO", "MARIA AUXILIADORA", "AYOLAS"];
    let arrayAltop = ["KM 7", "SANTA RITA", "CAMPO 9"];
    let arraySanpe = ["SANTANI"];

    //console.log('DESDE SUMAR MONTOS', los_acumulados_mes_ant.length);

    for (let r of los_acumulados_mes_act) {
      // Suma los montos de los acumulados mes anterior
      if (arrayAsuncion.includes(r.SUCURSAL)) {
        sumTotalesAsuncionCS_ += parseInt(r.CUOTA_SOCIAL);
        sumTotalesAsuncionTT_ += parseInt(r.TRATAMIENTO);
        sumTotalesAsuncionCO_ += parseInt(r.COBRADOR);
        sumTotalesAsuncionVN_ += parseInt(r.VENTA_NUEVA);
        sumTotalesAsuncionMT_ += parseInt(r.MONTO_TOTAL);

        if (r.SUCURSAL == "ADMINISTRACION") {
          totalAdministracion_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "MARISCAL LOPEZ") {
          totalML_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "MCAL. LOPEZ URGENCIAS") {
          totalMLU_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "AVENIDA QUINTA") {
          totalAQ_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "VILLA MORRA") {
          totalVM_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "ARTIGAS") {
          totalART_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "LUISITO") {
          totalLUI_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "PALMA") {
          totalPAL_ = r.MONTO_TOTAL;
        }
      }

      if (arrayGAsuncion.includes(r.SUCURSAL)) {
        sumTotalesGAsuncionCS_ += parseInt(r.CUOTA_SOCIAL);
        sumTotalesGAsuncionTT_ += parseInt(r.TRATAMIENTO);
        sumTotalesGAsuncionCO_ += parseInt(r.COBRADOR);
        sumTotalesGAsuncionVN_ += parseInt(r.VENTA_NUEVA);
        sumTotalesGAsuncionMT_ += parseInt(r.MONTO_TOTAL);

        if (r.SUCURSAL == "LAMBARE") {
          totalLAM_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "CATEDRAL") {
          totalCAT_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "LUQUE") {
          totalLUQ_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "LA RURAL") {
          totalLAR_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "ÑEMBY") {
          totalNEM_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "ITAUGUA") {
          totalITA_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "1811 SUCURSAL") {
          total1811_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "KM 14 Y MEDIO") {
          totalKM14_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "CAPIATA") {
          totalCAP_ = r.MONTO_TOTAL;
        }
      }

      if (arrayRuta2.includes(r.SUCURSAL)) {
        sumTotalesR2CS_ += parseInt(r.CUOTA_SOCIAL);
        sumTotalesR2TT_ += parseInt(r.TRATAMIENTO);
        sumTotalesR2CO_ += parseInt(r.COBRADOR);
        sumTotalesR2VN_ += parseInt(r.VENTA_NUEVA);
        sumTotalesR2MT_ += parseInt(r.MONTO_TOTAL);

        if (r.SUCURSAL == "CAACUPE") {
          totalCAACU_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "CORONEL OVIEDO") {
          totalCORO_ = r.MONTO_TOTAL;
        }
      }

      if (arrayItapua.includes(r.SUCURSAL)) {
        sumTotalesItaCS_ += parseInt(r.CUOTA_SOCIAL);
        sumTotalesItaTT_ += parseInt(r.TRATAMIENTO);
        sumTotalesItaCO_ += parseInt(r.COBRADOR);
        sumTotalesItaVN_ += parseInt(r.VENTA_NUEVA);
        sumTotalesItaMT_ += parseInt(r.MONTO_TOTAL);

        if (r.SUCURSAL == "HOHENAU") {
          totalHOHE_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "ENCARNACION CENTRO") {
          totalENCAR_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "MARIA AUXILIADORA") {
          totalMARAUX_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "AYOLAS") {
          totalAYO_ = r.MONTO_TOTAL;
        }
      }

      if (arrayAltop.includes(r.SUCURSAL)) {
        sumTotalesApCS_ += parseInt(r.CUOTA_SOCIAL);
        sumTotalesApTT_ += parseInt(r.TRATAMIENTO);
        sumTotalesApCO_ += parseInt(r.COBRADOR);
        sumTotalesApVN_ += parseInt(r.VENTA_NUEVA);
        sumTotalesApMT_ += parseInt(r.MONTO_TOTAL);

        if (r.SUCURSAL == "KM 7") {
          totalKM7_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "SANTA RITA") {
          totalSANRIT_ = r.MONTO_TOTAL;
        }

        if (r.SUCURSAL == "CAMPO 9") {
          totalCAM9_ = r.MONTO_TOTAL;
        }
      }

      if (arraySanpe.includes(r.SUCURSAL)) {
        sumTotalesSpCS_ += parseInt(r.CUOTA_SOCIAL);
        sumTotalesSpTT_ += parseInt(r.TRATAMIENTO);
        sumTotalesSpCO_ += parseInt(r.COBRADOR);
        sumTotalesSpVN_ += parseInt(r.VENTA_NUEVA);
        sumTotalesSpMT_ += parseInt(r.MONTO_TOTAL);

        if (r.SUCURSAL == "SANTANI") {
          totalSANTANI_ = r.MONTO_TOTAL;
        }
      }
    }

    // Totales Generales mes actual
    totalGenCuotaSocial_ =
      sumTotalesAsuncionCS_ +
      sumTotalesGAsuncionCS_ +
      sumTotalesR2CS_ +
      sumTotalesItaCS_ +
      sumTotalesApCS_ +
      sumTotalesSpCS_;
    totalGenTratamiento_ =
      sumTotalesAsuncionTT_ +
      sumTotalesGAsuncionTT_ +
      sumTotalesR2TT_ +
      sumTotalesItaTT_ +
      sumTotalesApTT_ +
      sumTotalesSpTT_;
    totalGenCobrador_ =
      sumTotalesAsuncionCO_ +
      sumTotalesGAsuncionCO_ +
      sumTotalesR2CO_ +
      sumTotalesItaCO_ +
      sumTotalesApCO_ +
      sumTotalesSpCO_;
    totalGenVentaNueva_ =
      sumTotalesAsuncionVN_ +
      sumTotalesGAsuncionVN_ +
      sumTotalesR2VN_ +
      sumTotalesItaVN_ +
      sumTotalesApVN_ +
      sumTotalesSpVN_;
    totalGenMontoTotal_ =
      sumTotalesAsuncionMT_ +
      sumTotalesGAsuncionMT_ +
      sumTotalesR2MT_ +
      sumTotalesItaMT_ +
      sumTotalesApMT_ +
      sumTotalesSpMT_;

    // Suma las cantidades de los ingresos mes actual
    for (let t of losIngresosMesAct) {
      totalGenINCuotaSocial_ += parseInt(t.CUOTA_SOCIAL);
      totalGenINTratamiento_ += parseInt(t.TRATAMIENTO);
      totalGenINCobrador_ += parseInt(t.COBRADOR);
      totalGenINVentaNueva_ += parseInt(t.VENTA_NUEVA);
      totalGenINMontoTotal_ += parseInt(t.MONTO_TOTAL);

      // Totales por TIPO
      if (t.TIPO == "PAGOS ELECTRONICOS") {
        totalPagosElectronicos_ = parseFloat(t.MONTO_TOTAL);
      }

      if (t.TIPO == "ASO. DEB.") {
        totalAsoDeb_ = parseFloat(t.MONTO_TOTAL);
      }

      if (t.TIPO == "LICITACIONES") {
        totalLicitaciones_ = parseFloat(t.MONTO_TOTAL);
      }

      if (t.TIPO == "TRANSF. GIROS PALMA") {
        totalTransGirosPalma_ = parseFloat(t.MONTO_TOTAL);
      }
    }

    /**
     *  DIFERENCIAS ACUMULADOS
     */
    totalDifAdministracion = parseInt(totalAdministracion_ - totalAdministracion);
    totalDifML = parseInt(totalML_ - totalML);
    totalDifMLU = parseInt(totalMLU_ - totalMLU);
    totalDifAQ = parseInt(totalAQ_ - totalAQ);
    totalDifVM = parseInt(totalVM_ - totalVM);
    totalDifART = parseInt(totalART_ - totalART);
    totalDifLUI = parseInt(totalLUI_ - totalLUI);
    totalDifPAL = parseInt(totalPAL_ - totalPAL);

    totalDifLAM = parseInt(totalLAM_ - totalLAM);
    totalDifCAT = parseInt(totalCAT_ - totalCAT);
    totalDifLUQ = parseInt(totalLUQ_ - totalLUQ);
    totalDifLAR = parseInt(totalLAR_ - totalLAR);
    totalDifNEM = parseInt(totalNEM_ - totalNEM);
    totalDifITA = parseInt(totalITA_ - totalITA);
    totalDif1811 = parseInt(total1811_ - total1811);
    totalDifKM14 = parseInt(totalKM14_ - totalKM14);
    totalDifCAP = parseInt(totalCAP_ - totalCAP);

    totalDifCAACU = parseInt(totalCAACU_ - totalCAACU);
    totalDifCORO = parseInt(totalCORO_ - totalCORO);

    totalDifHOHE = parseInt(totalHOHE_ - totalHOHE);
    totalDifENCAR = parseInt(totalENCAR_ - totalENCAR);
    totalDifMARAUX = parseInt(totalMARAUX_ - totalMARAUX);
    totalDifAYO = parseInt(totalAYO_ - totalAYO);

    totalDifKM7 = parseInt(totalKM7_ - totalKM7);
    totalDifSANRIT = parseInt(totalSANRIT_ - totalSANRIT);
    totalDifCAM9 = parseInt(totalCAM9_ - totalCAM9);

    totalDifSANTANI = parseInt(totalSANTANI_ - totalSANTANI);

    /** DIFERENCIAS TOTALES ACUMULADOS */
    difTotalesAsuncionMT = parseInt(sumTotalesAsuncionMT_ - sumTotalesAsuncionMT);
    difTotalesGAsuncionMT = parseInt(sumTotalesGAsuncionMT_ - sumTotalesGAsuncionMT);
    difTotalesR2MT = parseInt(sumTotalesR2MT_ - sumTotalesR2MT);
    difTotalesItaMT = parseInt(sumTotalesItaMT_ - sumTotalesItaMT);
    difTotalesApMT = parseInt(sumTotalesApMT_ - sumTotalesApMT);
    difTotalesSpMT = parseInt(sumTotalesSpMT_ - sumTotalesSpMT);

    /** DIFERENCIAS TOTALES INGRESOS */
    totalDifPagoElectronico = parseInt(totalPagosElectronicos_ - totalPagosElectronicos);
    totalDifAsoDeb = parseInt(totalAsoDeb_ - totalAsoDeb);
    totalDifLicitaciones = parseInt(totalLicitaciones_ - totalLicitaciones);
    totalDifTransGirosPalma = parseInt(totalTransGirosPalma_ - totalTransGirosPalma);

    totalDifTotalADM = parseInt(totalGenINMontoTotal_ - totalGenINMontoTotal);
  }

  // Define el color del texto segun el monto
  function colorSegunMonto(monto) {
    let colorText = "green";

    if (monto < 0) {
      colorText = "red";
    }

    return colorText;
  }

  // Se dibuja la Imagen - Envia los mensajes
  let retraso = () => new Promise((r) => setTimeout(r, tiempoRetrasoEnvios));
  async function enviarMensaje() {
    console.log("Inicia el recorrido del for para dibujar y enviar el reporte");

    // Dibuja la imagen
    loadImage(imagePath)
      .then((image) => {
        // Dibuja la imagen de fondo
        context.drawImage(image, 0, 0, width, height);

        // Eje X e Y de las fechas
        let ejeXFechaAnt = 700;
        let ejeXFechaAct = 1330;

        let ejeYFechaAnt = 115;
        let ejeYFechaAct = 115;

        // Eje X de cada celda
        let ejeXsucu = 27;
        let ejeXcuota = 385;
        let ejeXtrata = 530;
        let ejeXcobra = 660;
        let ejeXventa = 760;
        let ejeXmonto = 910;

        let ejeXcuota_ = 1035;
        let ejeXtrata_ = 1160;
        let ejeXcobra_ = 1280;
        let ejeXventa_ = 1390;
        let ejeXmonto_ = 1520;
        let ejeXdiferencia_ = 1650;

        // Eje Y de cada fila
        let ejeYadm = 194;
        let ejeYml = 218;
        let ejeYmlurg = 238;
        let ejeYaq = 258;
        let ejeYvm = 278;
        let ejeYar = 298;
        let ejeYlu = 318;
        let ejeYpa = 338;
        let ejeYtotalesAsu = 358;

        let ejeYlam = 388;
        let ejeYcat = 408;
        let ejeYluq = 428;
        let ejeYlar = 448;
        let ejeYnem = 468;
        let ejeYita = 488;
        let ejeY1811 = 508;
        let ejeYkm14 = 528;
        let ejeYcap = 548;
        let ejeYtotalesGranAsu = 568;

        let ejeYcaac = 598;
        let ejeYcoro = 618;
        let ejeYtotalesRuta2 = 638;

        let ejeYhohe = 668;
        let ejeYencar = 688;
        let ejeYmaria = 708;
        let ejeYayo = 728;
        let ejeYtotalesItapua = 748;

        let ejeYkm7 = 778;
        let ejeYsanta = 798;
        let ejeYcampo = 818;
        let ejeYtotalesAltoP = 838;

        let ejeYsantani = 868;
        let ejeYtotalesSanPe = 888;

        // Eje Y Total Sucursales
        let ejeYTotalGeneral = 928;

        // Eje Y Ingresos
        let ejeYPagosElectronicos = 968;
        let ejeYAsoDebito = 988;
        let ejeYLicitacion = 1008;
        let ejeYTransGirosPalma = 1028;
        let ejeYTotalADM = 1048;

        let ejeYtotalGeneralDoc = 1088;

        // Dibujar el cuadro de mes anterior
        for (let r of losAcumuladosMesAntForma) {
          // Zona ASU
          if (r.SUCURSAL == "ADMINISTRACION") {
            // Se dibuja los datos del cierre
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYadm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYadm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYadm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYadm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYadm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYadm);
          }

          if (r.SUCURSAL == "MARISCAL LOPEZ") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYml);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYml);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYml);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYml);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYml);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYml);
          }

          if (r.SUCURSAL == "MCAL. LOPEZ URGENCIAS") {
            // Se dibuja los datos del cierre
            context.font = "bold 13px Arial";
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYmlurg);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYmlurg);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYmlurg);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYmlurg);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYmlurg);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYmlurg);
          }

          if (r.SUCURSAL == "AVENIDA QUINTA") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYaq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYaq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYaq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYaq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYaq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYaq);
          }

          if (r.SUCURSAL == "VILLA MORRA") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYvm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYvm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYvm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYvm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYvm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYvm);
          }

          if (r.SUCURSAL == "ARTIGAS") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYar);
          }

          if (r.SUCURSAL == "LUISITO") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYlu);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYlu);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYlu);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYlu);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYlu);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYlu);
          }

          if (r.SUCURSAL == "PALMA") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYpa);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYpa);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYpa);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYpa);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYpa);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYpa);
          }

          // Zona Gran ASU
          if (r.SUCURSAL == "LAMBARE") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYlam);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYlam);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYlam);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYlam);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYlam);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYlam);
          }

          if (r.SUCURSAL == "CATEDRAL") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYcat);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYcat);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYcat);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYcat);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYcat);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYcat);
          }

          if (r.SUCURSAL == "LUQUE") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYluq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYluq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYluq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYluq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYluq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYluq);
          }

          if (r.SUCURSAL == "LA RURAL") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYlar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYlar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYlar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYlar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYlar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYlar);
          }

          if (r.SUCURSAL == "ÑEMBY") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYnem);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYnem);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYnem);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYnem);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYnem);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYnem);
          }

          if (r.SUCURSAL == "ITAUGUA") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYita);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYita);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYita);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYita);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYita);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYita);
          }

          if (r.SUCURSAL == "1811 SUCURSAL") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeY1811);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeY1811);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeY1811);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeY1811);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeY1811);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeY1811);
          }

          if (r.SUCURSAL == "KM 14 Y MEDIO") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYkm14);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYkm14);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYkm14);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYkm14);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYkm14);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYkm14);
          }

          if (r.SUCURSAL == "CAPIATA") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYcap);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYcap);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYcap);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYcap);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYcap);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYcap);
          }

          // Zona Ruta 2
          if (r.SUCURSAL == "CAACUPE") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYcaac);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYcaac);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYcaac);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYcaac);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYcaac);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYcaac);
          }

          if (r.SUCURSAL == "CORONEL OVIEDO") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYcoro);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYcoro);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYcoro);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYcoro);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYcoro);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYcoro);
          }

          // Zona Itapua
          if (r.SUCURSAL == "HOHENAU") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYhohe);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYhohe);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYhohe);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYhohe);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYhohe);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYhohe);
          }

          if (r.SUCURSAL == "ENCARNACION CENTRO") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYencar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYencar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYencar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYencar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYencar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYencar);
          }

          if (r.SUCURSAL == "MARIA AUXILIADORA") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYmaria);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYmaria);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYmaria);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYmaria);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYmaria);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYmaria);
          }

          if (r.SUCURSAL == "AYOLAS") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYayo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYayo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYayo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYayo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYayo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYayo);
          }

          // Zona Alto Parana
          if (r.SUCURSAL == "KM 7") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYkm7);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYkm7);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYkm7);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYkm7);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYkm7);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYkm7);
          }

          if (r.SUCURSAL == "SANTA RITA") {
            // Se dibuja los datos acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYsanta);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYsanta);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYsanta);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYsanta);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYsanta);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYsanta);
          }

          if (r.SUCURSAL == "CAMPO 9") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYcampo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYcampo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYcampo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYcampo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYcampo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYcampo);
          }

          // Zona San Pedro
          if (r.SUCURSAL == "SANTANI") {
            // Se dibuja los datos del acumulado mes anterior
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.SUCURSAL, ejeXsucu, ejeYsantani);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota, ejeYsantani);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata, ejeYsantani);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra, ejeYsantani);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa, ejeYsantani);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto, ejeYsantani);
          }
        }

        // Recorre los ingresos de mes anterior
        for (let r of losIngresosMesAnt) {
          if (r.TIPO == "PAGOS ELECTRONICOS") {
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.TIPO, ejeXsucu, ejeYPagosElectronicos);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.CUOTA_SOCIAL).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXcuota,
              ejeYPagosElectronicos
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.TRATAMIENTO).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXtrata,
              ejeYPagosElectronicos
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.COBRADOR).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXcobra,
              ejeYPagosElectronicos
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.VENTA_NUEVA).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXventa,
              ejeYPagosElectronicos
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.MONTO_TOTAL).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXmonto,
              ejeYPagosElectronicos
            );
          }

          if (r.TIPO == "ASO. DEB.") {
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.TIPO, ejeXsucu, ejeYAsoDebito);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.CUOTA_SOCIAL).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXcuota,
              ejeYAsoDebito
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.TRATAMIENTO).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXtrata,
              ejeYAsoDebito
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.COBRADOR).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXcobra,
              ejeYAsoDebito
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.VENTA_NUEVA).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXventa,
              ejeYAsoDebito
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.MONTO_TOTAL).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXmonto,
              ejeYAsoDebito
            );
          }

          if (r.TIPO == "LICITACIONES") {
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.TIPO, ejeXsucu, ejeYLicitacion);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.CUOTA_SOCIAL).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXcuota,
              ejeYLicitacion
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.TRATAMIENTO).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXtrata,
              ejeYLicitacion
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.COBRADOR).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXcobra,
              ejeYLicitacion
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.VENTA_NUEVA).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXventa,
              ejeYLicitacion
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.MONTO_TOTAL).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXmonto,
              ejeYLicitacion
            );
          }

          if (r.TIPO == "TRANSF. GIROS PALMA") {
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "left";
            context.fillText(r.TIPO, ejeXsucu, ejeYTransGirosPalma);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.CUOTA_SOCIAL).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXcuota,
              ejeYTransGirosPalma
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.TRATAMIENTO).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXtrata,
              ejeYTransGirosPalma
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.COBRADOR).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXcobra,
              ejeYTransGirosPalma
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.VENTA_NUEVA).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXventa,
              ejeYTransGirosPalma
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.MONTO_TOTAL).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXmonto,
              ejeYTransGirosPalma
            );
          }
        }

        // Dibujar el cuadro de mes actual
        for (let r of losAcumuladosMesActForma) {
          // Zona ASU
          if (r.SUCURSAL == "ADMINISTRACION") {
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYadm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYadm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYadm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYadm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYadm);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifAdministracion);
            context.textAlign = "right";
            context.fillText(
              totalDifAdministracion.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYadm
            );
          }

          if (r.SUCURSAL == "MARISCAL LOPEZ") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYml);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYml);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYml);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYml);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYml);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifML);
            context.textAlign = "right";
            context.fillText(
              totalDifML.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYml
            );
          }

          if (r.SUCURSAL == "MCAL. LOPEZ URGENCIAS") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYmlurg);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYmlurg);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYmlurg);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYmlurg);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYmlurg);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifMLU);
            context.textAlign = "right";
            context.fillText(
              totalDifMLU.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYmlurg
            );
          }

          if (r.SUCURSAL == "AVENIDA QUINTA") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYaq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYaq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYaq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYaq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYaq);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifAQ);
            context.textAlign = "right";
            context.fillText(
              totalDifAQ.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYaq
            );
          }

          if (r.SUCURSAL == "VILLA MORRA") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYvm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYvm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYvm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYvm);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYvm);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifVM);
            context.textAlign = "right";
            context.fillText(
              totalDifVM.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYvm
            );
          }

          if (r.SUCURSAL == "ARTIGAS") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYar);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifART);
            context.textAlign = "right";
            context.fillText(
              totalDifART.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYar
            );
          }

          if (r.SUCURSAL == "LUISITO") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYlu);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYlu);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYlu);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYlu);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYlu);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifLUI);
            context.textAlign = "right";
            context.fillText(
              totalDifLUI.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYlu
            );
          }

          if (r.SUCURSAL == "PALMA") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYpa);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYpa);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYpa);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYpa);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYpa);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifPAL);
            context.textAlign = "right";
            context.fillText(
              totalDifPAL.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYpa
            );
          }

          // Zona Gran ASU
          if (r.SUCURSAL == "LAMBARE") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYlam);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYlam);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYlam);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYlam);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYlam);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifLAM);
            context.textAlign = "right";
            context.fillText(
              totalDifLAM.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYlam
            );
          }

          if (r.SUCURSAL == "CATEDRAL") {
            // Se dibuja los datos del acumulado mes actual
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYcat);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYcat);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYcat);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYcat);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYcat);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifCAT);
            context.textAlign = "right";
            context.fillText(
              totalDifCAT.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYcat
            );
          }

          if (r.SUCURSAL == "LUQUE") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYluq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYluq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYluq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYluq);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYluq);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifLUQ);
            context.textAlign = "right";
            context.fillText(
              totalDifLUQ.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYluq
            );
          }

          if (r.SUCURSAL == "LA RURAL") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYlar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYlar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYlar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYlar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYlar);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifLAR);
            context.textAlign = "right";
            context.fillText(
              totalDifLAR.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYlar
            );
          }

          if (r.SUCURSAL == "ÑEMBY") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYnem);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYnem);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYnem);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYnem);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYnem);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifNEM);
            context.textAlign = "right";
            context.fillText(
              totalDifNEM.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYnem
            );
          }

          if (r.SUCURSAL == "ITAUGUA") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYita);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYita);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYita);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYita);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYita);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifITA);
            context.textAlign = "right";
            context.fillText(
              totalDifITA.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYita
            );
          }

          if (r.SUCURSAL == "1811 SUCURSAL") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeY1811);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeY1811);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeY1811);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeY1811);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeY1811);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDif1811);
            context.textAlign = "right";
            context.fillText(
              totalDif1811.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeY1811
            );
          }

          if (r.SUCURSAL == "KM 14 Y MEDIO") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYkm14);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYkm14);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYkm14);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYkm14);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYkm14);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifKM14);
            context.textAlign = "right";
            context.fillText(
              totalDifKM14.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYkm14
            );
          }

          if (r.SUCURSAL == "CAPIATA") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYcap);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYcap);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYcap);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYcap);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYcap);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifCAP);
            context.textAlign = "right";
            context.fillText(
              totalDifCAP.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYcap
            );
          }

          // Zona Ruta 2
          if (r.SUCURSAL == "CAACUPE") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYcaac);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYcaac);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYcaac);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYcaac);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYcaac);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifCAACU);
            context.textAlign = "right";
            context.fillText(
              totalDifCAACU.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYcaac
            );
          }

          if (r.SUCURSAL == "CORONEL OVIEDO") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYcoro);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYcoro);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYcoro);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYcoro);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYcoro);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifCORO);
            context.textAlign = "right";
            context.fillText(
              totalDifCORO.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYcoro
            );
          }

          // Zona Itapua
          if (r.SUCURSAL == "HOHENAU") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYhohe);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYhohe);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYhohe);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYhohe);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYhohe);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifHOHE);
            context.textAlign = "right";
            context.fillText(
              totalDifHOHE.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYhohe
            );
          }

          if (r.SUCURSAL == "ENCARNACION CENTRO") {
            // Se dibuja los datos del acumulado mes actual
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYencar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYencar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYencar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYencar);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYencar);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifENCAR);
            context.textAlign = "right";
            context.fillText(
              totalDifENCAR.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYencar
            );
          }

          if (r.SUCURSAL == "MARIA AUXILIADORA") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYmaria);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYmaria);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYmaria);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYmaria);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYmaria);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifMARAUX);
            context.textAlign = "right";
            context.fillText(
              totalDifMARAUX.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYmaria
            );
          }

          if (r.SUCURSAL == "AYOLAS") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYayo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYayo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYayo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYayo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYayo);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifAYO);
            context.textAlign = "right";
            context.fillText(
              totalDifAYO.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYayo
            );
          }

          // Zona Alto Parana
          if (r.SUCURSAL == "KM 7") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYkm7);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYkm7);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYkm7);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYkm7);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYkm7);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifKM7);
            context.textAlign = "right";
            context.fillText(
              totalDifKM7.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYkm7
            );
          }

          if (r.SUCURSAL == "SANTA RITA") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYsanta);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYsanta);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYsanta);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYsanta);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYsanta);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifSANRIT);
            context.textAlign = "right";
            context.fillText(
              totalDifSANRIT.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYsanta
            );
          }

          if (r.SUCURSAL == "CAMPO 9") {
            // Se dibuja los datos acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYcampo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYcampo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYcampo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYcampo);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYcampo);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifCAM9);
            context.textAlign = "right";
            context.fillText(
              totalDifCAM9.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYcampo
            );
          }

          // Zona San Pedro
          if (r.SUCURSAL == "SANTANI") {
            // Se dibuja los datos del acumulado mes actual

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.CUOTA_SOCIAL, ejeXcuota_, ejeYsantani);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.TRATAMIENTO, ejeXtrata_, ejeYsantani);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.COBRADOR, ejeXcobra_, ejeYsantani);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.VENTA_NUEVA, ejeXventa_, ejeYsantani);

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(r.MONTO_TOTAL, ejeXmonto_, ejeYsantani);

            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifSANTANI);
            context.textAlign = "right";
            context.fillText(
              totalDifSANTANI.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYsantani
            );
          }
        }

        // Recorre los ingresos de mes actual
        for (let r of losIngresosMesAct) {
          if (r.TIPO == "PAGOS ELECTRONICOS") {
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.CUOTA_SOCIAL).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXcuota_,
              ejeYPagosElectronicos
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.TRATAMIENTO).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXtrata_,
              ejeYPagosElectronicos
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.COBRADOR).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXcobra_,
              ejeYPagosElectronicos
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.VENTA_NUEVA).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXventa_,
              ejeYPagosElectronicos
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.MONTO_TOTAL).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXmonto_,
              ejeYPagosElectronicos
            );

            // Diferencia ingresos pagos electronicos
            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifPagoElectronico);
            context.textAlign = "right";
            context.fillText(
              totalDifPagoElectronico.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYPagosElectronicos
            );
          }

          if (r.TIPO == "ASO. DEB.") {
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.CUOTA_SOCIAL).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXcuota_,
              ejeYAsoDebito
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.TRATAMIENTO).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXtrata_,
              ejeYAsoDebito
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.COBRADOR).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXcobra_,
              ejeYAsoDebito
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.VENTA_NUEVA).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXventa_,
              ejeYAsoDebito
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.MONTO_TOTAL).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXmonto_,
              ejeYAsoDebito
            );

            // Diferencia ingresos aso deb
            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifAsoDeb);
            context.textAlign = "right";
            context.fillText(
              totalDifAsoDeb.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYAsoDebito
            );
          }

          if (r.TIPO == "LICITACIONES") {
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.CUOTA_SOCIAL).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXcuota_,
              ejeYLicitacion
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.TRATAMIENTO).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXtrata_,
              ejeYLicitacion
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.COBRADOR).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXcobra_,
              ejeYLicitacion
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.VENTA_NUEVA).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXventa_,
              ejeYLicitacion
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.MONTO_TOTAL).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXmonto_,
              ejeYLicitacion
            );

            // Diferencia ingresos licitaciones
            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifLicitaciones);
            context.textAlign = "right";
            context.fillText(
              totalDifLicitaciones.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYLicitacion
            );
          }

          if (r.TIPO == "TRANSF. GIROS PALMA") {
            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.CUOTA_SOCIAL).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXcuota_,
              ejeYTransGirosPalma
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.TRATAMIENTO).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXtrata_,
              ejeYTransGirosPalma
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.COBRADOR).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXcobra_,
              ejeYTransGirosPalma
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.VENTA_NUEVA).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXventa_,
              ejeYTransGirosPalma
            );

            context.font = fuenteTexto;
            context.fillStyle = "#34495E";
            context.textAlign = "right";
            context.fillText(
              parseFloat(r.MONTO_TOTAL).toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXmonto_,
              ejeYTransGirosPalma
            );

            // Diferencia ingresos trans giros palma
            context.font = fuenteTexto;
            context.fillStyle = colorSegunMonto(totalDifTransGirosPalma);
            context.textAlign = "right";
            context.fillText(
              totalDifTransGirosPalma.toLocaleString("es", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              ejeXdiferencia_,
              ejeYTransGirosPalma
            );
          }
        }

        // Dibujar las fechas
        // Mes Anterior
        context.font = "bold 13px Arial";
        context.fillStyle = "white";
        context.textAlign = "left";
        context.fillText(fechaConsultaMesAnt, ejeXFechaAnt, ejeYFechaAnt);
        // Mes actual
        context.font = "bold 13px Arial";
        context.fillStyle = "white";
        context.textAlign = "left";
        context.fillText(fechaConsultaMesAct, ejeXFechaAct, ejeYFechaAct);

        // Fila totales ZONA ASUNCION
        // SUM - Monto Total ZONA ASUNCION - MES ANTERIOR
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "left";
        context.fillText("ZONA ASUNCIÓN", ejeXsucu, ejeYtotalesAsu);

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesAsuncionCS.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota,
          ejeYtotalesAsu
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesAsuncionTT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata,
          ejeYtotalesAsu
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesAsuncionCO.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra,
          ejeYtotalesAsu
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesAsuncionVN.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa,
          ejeYtotalesAsu
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesAsuncionMT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto,
          ejeYtotalesAsu
        );

        // SUM - Monto Total ZONA ASUNCION - MES ACTUAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesAsuncionCS_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota_,
          ejeYtotalesAsu
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesAsuncionTT_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata_,
          ejeYtotalesAsu
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesAsuncionCO_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra_,
          ejeYtotalesAsu
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesAsuncionVN_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa_,
          ejeYtotalesAsu
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesAsuncionMT_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto_,
          ejeYtotalesAsu
        );

        context.font = fuenteTextoBold;
        context.fillStyle = colorSegunMonto(difTotalesAsuncionMT);
        context.textAlign = "right";
        context.fillText(
          difTotalesAsuncionMT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXdiferencia_,
          ejeYtotalesAsu
        );

        // SUM - Monto Total ZONA GRAN ASUNCION - MES ANTERIOR
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "left";
        context.fillText("ZONA GRAN ASUNCIÓN", ejeXsucu, ejeYtotalesGranAsu);

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesGAsuncionCS.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota,
          ejeYtotalesGranAsu
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesGAsuncionTT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata,
          ejeYtotalesGranAsu
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesGAsuncionCO.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra,
          ejeYtotalesGranAsu
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesGAsuncionVN.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa,
          ejeYtotalesGranAsu
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesGAsuncionMT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto,
          ejeYtotalesGranAsu
        );

        // SUM - Monto Total ZONA GRAN ASUNCION - MES ACTUAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesGAsuncionCS_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota_,
          ejeYtotalesGranAsu
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesGAsuncionTT_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata_,
          ejeYtotalesGranAsu
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesGAsuncionCO_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra_,
          ejeYtotalesGranAsu
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesGAsuncionVN_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa_,
          ejeYtotalesGranAsu
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesGAsuncionMT_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto_,
          ejeYtotalesGranAsu
        );

        context.font = fuenteTextoBold;
        context.fillStyle = colorSegunMonto(difTotalesGAsuncionMT);
        context.textAlign = "right";
        context.fillText(
          difTotalesGAsuncionMT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXdiferencia_,
          ejeYtotalesGranAsu
        );

        // SUM - Monto Total ZONA RUTA 2 - MES ANTERIOR
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "left";
        context.fillText("ZONA RUTA 2", ejeXsucu, ejeYtotalesRuta2);

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesR2CS.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota,
          ejeYtotalesRuta2
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesR2TT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata,
          ejeYtotalesRuta2
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesR2CO.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra,
          ejeYtotalesRuta2
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesR2VN.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa,
          ejeYtotalesRuta2
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesR2MT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto,
          ejeYtotalesRuta2
        );

        // SUM - Monto Total ZONA RUTA 2 - MES ACTUAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesR2CS_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota_,
          ejeYtotalesRuta2
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesR2TT_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata_,
          ejeYtotalesRuta2
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesR2CO_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra_,
          ejeYtotalesRuta2
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesR2VN_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa_,
          ejeYtotalesRuta2
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesR2MT_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto_,
          ejeYtotalesRuta2
        );

        context.font = fuenteTextoBold;
        context.fillStyle = colorSegunMonto(difTotalesR2MT);
        context.textAlign = "right";
        context.fillText(
          difTotalesR2MT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXdiferencia_,
          ejeYtotalesRuta2
        );

        // SUM - Monto Total ZONA ITAPUA - MES ANTERIOR
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "left";
        context.fillText("ZONA ITAPUA", ejeXsucu, ejeYtotalesItapua);

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesItaCS.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota,
          ejeYtotalesItapua
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesItaTT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata,
          ejeYtotalesItapua
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesItaCO.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra,
          ejeYtotalesItapua
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesItaVN.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa,
          ejeYtotalesItapua
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesItaMT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto,
          ejeYtotalesItapua
        );

        // SUM - Monto Total ZONA ITAPUA - MES ACTUAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesItaCS_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota_,
          ejeYtotalesItapua
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesItaTT_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata_,
          ejeYtotalesItapua
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesItaCO_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra_,
          ejeYtotalesItapua
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesItaVN_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa_,
          ejeYtotalesItapua
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesItaMT_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto_,
          ejeYtotalesItapua
        );

        context.font = fuenteTextoBold;
        context.fillStyle = colorSegunMonto(difTotalesItaMT);
        context.textAlign = "right";
        context.fillText(
          difTotalesItaMT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXdiferencia_,
          ejeYtotalesItapua
        );

        // SUM - Monto Total ZONA ALTO PARANA - MES ANTERIOR
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "left";
        context.fillText("ZONA ALTO PARANA", ejeXsucu, ejeYtotalesAltoP);

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesApCS.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota,
          ejeYtotalesAltoP
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesApTT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata,
          ejeYtotalesAltoP
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesApCO.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra,
          ejeYtotalesAltoP
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesApVN.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa,
          ejeYtotalesAltoP
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesApMT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto,
          ejeYtotalesAltoP
        );

        // SUM - Monto Total ZONA ALTO PARANA - MES ACTUAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesApCS_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota_,
          ejeYtotalesAltoP
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesApTT_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata_,
          ejeYtotalesAltoP
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesApCO_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra_,
          ejeYtotalesAltoP
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesApVN_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa_,
          ejeYtotalesAltoP
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesApMT_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto_,
          ejeYtotalesAltoP
        );

        context.font = fuenteTextoBold;
        context.fillStyle = colorSegunMonto(difTotalesApMT);
        context.textAlign = "right";
        context.fillText(
          difTotalesApMT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXdiferencia_,
          ejeYtotalesAltoP
        );

        // SUM - Monto Total ZONA SAN PEDRO - MES ANTERIOR
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "left";
        context.fillText("ZONA SAN PEDRO", ejeXsucu, ejeYtotalesSanPe);

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesSpCS.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota,
          ejeYtotalesSanPe
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesSpTT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata,
          ejeYtotalesSanPe
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesSpCO.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra,
          ejeYtotalesSanPe
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesSpVN.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa,
          ejeYtotalesSanPe
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesSpMT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto,
          ejeYtotalesSanPe
        );

        // SUM - Monto Total ZONA SAN PEDRO - MES ACTUAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesSpCS_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota_,
          ejeYtotalesSanPe
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesSpTT_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata_,
          ejeYtotalesSanPe
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesSpCO_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra_,
          ejeYtotalesSanPe
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesSpVN_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa_,
          ejeYtotalesSanPe
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          sumTotalesSpMT_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto_,
          ejeYtotalesSanPe
        );

        context.font = fuenteTextoBold;
        context.fillStyle = colorSegunMonto(difTotalesSpMT);
        context.textAlign = "right";
        context.fillText(
          difTotalesSpMT.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXdiferencia_,
          ejeYtotalesSanPe
        );

        /**
         *  TOTAL SUCURSAL - MES ANTERIOR
         */
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "left";
        context.fillText("TOTAL SUCURSALES", ejeXsucu, ejeYTotalGeneral);

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenCuotaSocial.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota,
          ejeYTotalGeneral
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenTratamiento.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata,
          ejeYTotalGeneral
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenCobrador.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra,
          ejeYTotalGeneral
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenVentaNueva.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa,
          ejeYTotalGeneral
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenMontoTotal.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto,
          ejeYTotalGeneral
        );

        /**
         *  TOTAL SUCURSAL - MES ACTUAL
         */
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenCuotaSocial_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota_,
          ejeYTotalGeneral
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenTratamiento_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata_,
          ejeYTotalGeneral
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenCobrador_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra_,
          ejeYTotalGeneral
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenVentaNueva_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa_,
          ejeYTotalGeneral
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenMontoTotal_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto_,
          ejeYTotalGeneral
        );

        // DIFERENCIA TOTAL SUCURSAL
        context.font = fuenteTextoBold;
        context.fillStyle = colorSegunMonto(totalGenMontoTotal_ - totalGenMontoTotal);
        context.textAlign = "right";
        context.fillText(
          (totalGenMontoTotal_ - totalGenMontoTotal).toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXdiferencia_,
          ejeYTotalGeneral
        );

        /**
         *   TOTAL ADM - INGRESOS MES ANTERIOR
         */
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "left";
        context.fillText("TOTAL ADM", ejeXsucu, ejeYTotalADM);

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenINCuotaSocial.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota,
          ejeYTotalADM
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenINTratamiento.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata,
          ejeYTotalADM
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenINCobrador.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra,
          ejeYTotalADM
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenINVentaNueva.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa,
          ejeYTotalADM
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenINMontoTotal.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto,
          ejeYTotalADM
        );

        /**
         *   TOTAL ADM - INGRESOS MES ACTUAL
         */

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenINCuotaSocial_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota_,
          ejeYTotalADM
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenINTratamiento_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata_,
          ejeYTotalADM
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenINCobrador_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra_,
          ejeYTotalADM
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenINVentaNueva_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa_,
          ejeYTotalADM
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          totalGenINMontoTotal_.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto_,
          ejeYTotalADM
        );

        // Diferencia monto total adm
        context.font = fuenteTextoBold;
        context.fillStyle = colorSegunMonto(totalDifTotalADM);
        context.textAlign = "right";
        context.fillText(
          totalDifTotalADM.toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXdiferencia_,
          ejeYTotalADM
        );

        /**
         *   TOTAL GENERAL - TOTAL DOC mes anterior
         */

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "left";
        context.fillText("TOTAL GENERAL", ejeXsucu, ejeYtotalGeneralDoc);

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          (totalGenCuotaSocial + totalGenINCuotaSocial).toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota,
          ejeYtotalGeneralDoc
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          (totalGenTratamiento + totalGenINTratamiento).toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata,
          ejeYtotalGeneralDoc
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          (totalGenCobrador + totalGenINCobrador).toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra,
          ejeYtotalGeneralDoc
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          (totalGenVentaNueva + totalGenINVentaNueva).toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa,
          ejeYtotalGeneralDoc
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          (totalGenMontoTotal + totalGenINMontoTotal).toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto,
          ejeYtotalGeneralDoc
        );

        // TOTAL GENERAL - TOTAL DOC mes actual

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          (totalGenCuotaSocial_ + totalGenINCuotaSocial_).toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcuota_,
          ejeYtotalGeneralDoc
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          (totalGenTratamiento_ + totalGenINTratamiento_).toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXtrata_,
          ejeYtotalGeneralDoc
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          (totalGenCobrador_ + totalGenINCobrador_).toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXcobra_,
          ejeYtotalGeneralDoc
        );

        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          (totalGenVentaNueva_ + totalGenINVentaNueva_).toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXventa_,
          ejeYtotalGeneralDoc
        );

        // MONTO TOTAL
        context.font = fuenteTextoBold;
        context.fillStyle = "#34495E";
        context.textAlign = "right";
        context.fillText(
          (totalGenMontoTotal_ + totalGenINMontoTotal_).toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXmonto_,
          ejeYtotalGeneralDoc
        );

        // Diferencia monto TOTAL GENERAL DOC
        context.font = fuenteTextoBold;
        context.fillStyle = colorSegunMonto(
          totalGenMontoTotal_ - totalGenMontoTotal + totalDifTotalADM
        );
        context.textAlign = "right";
        context.fillText(
          (totalGenMontoTotal_ - totalGenMontoTotal + totalDifTotalADM).toLocaleString("es", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
          ejeXdiferencia_,
          ejeYtotalGeneralDoc
        );

        // Escribe la imagen a archivo
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync("./Reporte - Acumulado " + fechaConsulta + ".png", buffer);

        // Convierte el canvas en una imagen base64
        const base64Image = canvas.toDataURL();
        fileBase64Media = base64Image.split(",")[1];
      })
      .then(async () => {
        // Recorre el array de los numeros
        for (let n of numerosDestinatarios) {
          console.log(n);
          mensajeBody = {
            message: "Buenas noches, se envia el reporte de acumulados mes anterior y mes actual.",
            phone: n.NUMERO,
            mimeType: fileMimeTypeMedia,
            data: fileBase64Media,
            fileName: "",
            fileSize: "",
          };

          // Envia el mensaje por la API free WWA
          axios
            .post(wwaUrl, mensajeBody)
            .then((response) => {
              const data = response.data;

              if (data.responseExSave.id) {
                console.log("Enviado - OK");
                // Se actualiza el estado a 1
                const body = {
                  estado_envio: 1,
                };

                // Tickets.update(body, {
                //   where: { id_turno: turnoId },
                // })
                //   //.then((result) => res.json(result))
                //   .catch((error) => {
                //     res.status(412).json({
                //       msg: error.message,
                //     });
                //   });
              }

              if (data.responseExSave.unknow) {
                console.log("No Enviado - unknow");
                // Se actualiza el estado a 3
                const body = {
                  estado_envio: 3,
                };

                // Tickets.update(body, {
                //   where: { id_turno: turnoId },
                // })
                //   //.then((result) => res.json(result))
                //   .catch((error) => {
                //     res.status(412).json({
                //       msg: error.message,
                //     });
                //   });
              }

              if (data.responseExSave.error) {
                console.log("No enviado - error");
                const errMsg = data.responseExSave.error.slice(0, 17);
                if (errMsg === "Escanee el código") {
                  //updateEstatusERROR(turnoId, 104);
                  console.log("Error 104: ", data.responseExSave.error);
                }
                // Sesion cerrada o desvinculada. Puede que se envie al abrir la sesion o al vincular
                if (errMsg === "Protocol error (R") {
                  //updateEstatusERROR(turnoId, 105);
                  console.log("Error 105: ", data.responseExSave.error);
                }
                // El numero esta mal escrito o supera los 12 caracteres
                if (errMsg === "Evaluation failed") {
                  //updateEstatusERROR(turnoId, 106);
                  console.log("Error 106: ", data.responseExSave.error);
                }
              }
            })
            .catch((error) => {
              console.error("Ocurrió un error:", error);
            });

          await retraso();
        }

        console.log("Fin del envío del reporte de acumulados mes anterior y actual");
      })
      .then(() => {
        //console.log("Se resetean los montos");
        setTimeout(() => {
          console.log("Se resetearon los montos");
          resetMontos();
        }, 30000);
      });
  }

  function resetMontos() {
    // Sub Totales Zona Asuncion
    sumTotalesAsuncionCS = 0;
    sumTotalesAsuncionTT = 0;
    sumTotalesAsuncionCO = 0;
    sumTotalesAsuncionVN = 0;
    sumTotalesAsuncionMT = 0;

    sumTotalesAsuncionCS_ = 0;
    sumTotalesAsuncionTT_ = 0;
    sumTotalesAsuncionCO_ = 0;
    sumTotalesAsuncionVN_ = 0;
    sumTotalesAsuncionMT_ = 0;

    // Sub Totales Zona Gran Asuncion
    sumTotalesGAsuncionCS = 0;
    sumTotalesGAsuncionTT = 0;
    sumTotalesGAsuncionCO = 0;
    sumTotalesGAsuncionVN = 0;
    sumTotalesGAsuncionMT = 0;

    sumTotalesGAsuncionCS_ = 0;
    sumTotalesGAsuncionTT_ = 0;
    sumTotalesGAsuncionCO_ = 0;
    sumTotalesGAsuncionVN_ = 0;
    sumTotalesGAsuncionMT_ = 0;

    // Sub Totales Zona Ruta 2
    sumTotalesR2CS = 0;
    sumTotalesR2TT = 0;
    sumTotalesR2CO = 0;
    sumTotalesR2VN = 0;
    sumTotalesR2MT = 0;

    sumTotalesR2CS_ = 0;
    sumTotalesR2TT_ = 0;
    sumTotalesR2CO_ = 0;
    sumTotalesR2VN_ = 0;
    sumTotalesR2MT_ = 0;

    // Sub Totales Zona Itapua
    sumTotalesItaCS = 0;
    sumTotalesItaTT = 0;
    sumTotalesItaCO = 0;
    sumTotalesItaVN = 0;
    sumTotalesItaMT = 0;

    sumTotalesItaCS_ = 0;
    sumTotalesItaTT_ = 0;
    sumTotalesItaCO_ = 0;
    sumTotalesItaVN_ = 0;
    sumTotalesItaMT_ = 0;

    // Sub Totales Zona Alto Parana
    sumTotalesApCS = 0;
    sumTotalesApTT = 0;
    sumTotalesApCO = 0;
    sumTotalesApVN = 0;
    sumTotalesApMT = 0;

    sumTotalesApCS_ = 0;
    sumTotalesApTT_ = 0;
    sumTotalesApCO_ = 0;
    sumTotalesApVN_ = 0;
    sumTotalesApMT_ = 0;

    // Sub Totales Zona San Pedro
    sumTotalesSpCS = 0;
    sumTotalesSpTT = 0;
    sumTotalesSpCO = 0;
    sumTotalesSpVN = 0;
    sumTotalesSpMT = 0;

    sumTotalesSpCS_ = 0;
    sumTotalesSpTT_ = 0;
    sumTotalesSpCO_ = 0;
    sumTotalesSpVN_ = 0;
    sumTotalesSpMT_ = 0;

    // Totales Generales
    totalGenCuotaSocial = 0;
    totalGenTratamiento = 0;
    totalGenCobrador = 0;
    totalGenVentaNueva = 0;
    totalGenMontoTotal = 0;

    totalGenCuotaSocial_ = 0;
    totalGenTratamiento_ = 0;
    totalGenCobrador_ = 0;
    totalGenVentaNueva_ = 0;
    totalGenMontoTotal_ = 0;
  }
};
