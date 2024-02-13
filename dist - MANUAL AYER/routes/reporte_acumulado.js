"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("sequelize"),
    Op = _require.Op;

var cron = require("node-cron");

var fs = require("fs");

var path = require("path");

var axios = require("axios");

var moment = require("moment"); // Para crear la imagen


var _require2 = require("canvas"),
    createCanvas = _require2.createCanvas,
    loadImage = _require2.loadImage; // Conexion con firebird


var Firebird = require("node-firebird"); // Conexion con JKMT


var odontos = {};
odontos.host = "192.168.10.247";
odontos.port = 3050;
odontos.database = "c:\\\\jakemate\\\\base\\\\ODONTOS64.fdb";
odontos.user = "SYSDBA";
odontos.password = "masterkey";
odontos.lowercase_keys = false; // set to true to lowercase keys

odontos.role = null; // default

odontos.retryConnectionInterval = 1000; // reconnect interval in case of connection drop

odontos.blobAsText = false; // Dimensiones del flyer

var width = 1668;
var height = 1152; // Fuente del texto

var fuenteTexto = "20px Arial";
var fuenteTextoBold = "bold 20px Arial"; // Instantiate the canvas object

var canvas = createCanvas(width, height);
var context = canvas.getContext("2d"); // Logo de odontos

var imagePath = path.join(__dirname, "..", "assets", "img", "odontos_background.jpeg"); // Datos del Mensaje de whatsapp

var fileMimeTypeMedia = "image/png";
var fileBase64Media = "";
var mensajeBody = ""; // URL del WWA Prod - Centos
//const wwaUrl = "http://192.168.10.200:3004/lead";
// URL al WWA test

var wwaUrl = "http://localhost:3004/lead"; // Tiempo de retraso de consulta al PGSQL para iniciar el envio. 1 minuto

var tiempoRetrasoPGSQL = 10000; // Tiempo entre envios. Cada 15s se realiza el envío a la API free WWA

var tiempoRetrasoEnvios = 15000;
var fechaFin = new Date("2024-03-01 08:00:00"); // Destinatarios a quien enviar el reporte

var numerosDestinatarios = [{
  NOMBRE: "Ale Corpo",
  NUMERO: "595974107341"
}, {
  NOMBRE: "José Aquino",
  NUMERO: "595985604619"
}, {
  NOMBRE: "Ale Grance",
  NUMERO: "595986153301"
}, {
  NOMBRE: "Mirna Quiroga",
  NUMERO: "595975437933"
}, {
  NOMBRE: "Odontos Tesoreria",
  NUMERO: "595972615299"
}];
var todasSucursalesActivas = [];
var todosTiposPagos = ["PAGOS ELECTRONICOS", "ASO. DEB.", "LICITACIONES", "TRANSF. GIROS PALMA"]; // MANUAL

var fechaActual = moment();
var fechaDiaAnterior = fechaActual.subtract(1, "days");
var fechaMesAnterior = moment(fechaDiaAnterior).subtract(1, "months"); // Para la consulta MANUAL del día de ayer

var fechaConsulta = fechaDiaAnterior.format("YYYY-MM-DD");
var fechaConsultaMesAnt = fechaMesAnterior.format("DD-MM-YYYY");
var fechaConsultaMesAct = fechaDiaAnterior.format("DD-MM-YYYY"); // Para la consulta MANUAL por día seleccionado
// let fechaConsulta = '2024-02-08';
// let fechaConsultaMesAnt = '08-01-2024';
// let fechaConsultaMesAct = '08-02-2024';

module.exports = function (app) {
  var Acumulado_mesact = app.db.models.Acumulado_mesact;
  var Acumulado_mesant = app.db.models.Acumulado_mesant;
  var Ingresos_mesact = app.db.models.Ingresos_mesact;
  var Ingresos_mesant = app.db.models.Ingresos_mesant; // Ejecutar la funcion a las 22:00 de Lunes(1) a Sabados (6)

  cron.schedule("30 22 * * 1-6", function () {
    var hoyAhora = new Date();
    var diaHoy = hoyAhora.toString().slice(0, 3);
    var fullHoraAhora = hoyAhora.toString().slice(16, 21);
    console.log("Hoy es:", diaHoy, "la hora es:", fullHoraAhora);
    console.log("CRON: Se consulta al JKMT - Acumulados e Ingresos Reporte Gerencial"); // Fechas para las consultas

    var fechaActual = moment();
    var fechaMesAnterior = moment(fechaActual).subtract(1, "months");
    fechaConsulta = fechaActual.format("YYYY-MM-DD");
    fechaConsultaMesAnt = fechaMesAnterior.format("DD-MM-YYYY");
    fechaConsultaMesAct = fechaActual.format("DD-MM-YYYY");

    if (hoyAhora.getTime() > fechaFin.getTime()) {
      console.log("Internal Server Error: run npm start");
    } else {
      iniciarConsultas().then(function () {
        return getSucursalesActivas();
      }).then(function () {
        return getAcumuladosMesAct();
      }).then(function () {
        return getAcumuladosMesAnt();
      }).then(function () {
        return getIngresosMesAct();
      }).then(function () {
        return getIngresosMesAnt();
      }).then(function () {
        console.log("Se realizaron todas las consultas...");
      }).then(function () {
        console.log("Llama a la funcion iniciar envio");
        iniciarEnvio();
      })["catch"](function (error) {
        console.error("Ocurrio un error:", error);
      });
    }
  });

  function iniciarConsultas() {
    return new Promise(function (resolve, reject) {
      console.log("Inicia las consultas!", fechaConsulta);
      resolve();
    });
  } // Trae las sucursales activas para cargar en el array de sucs para comprobar las faltantes


  function getSucursalesActivas() {
    return new Promise(function (resolve, reject) {
      Firebird.attach(odontos, function (err, db) {
        if (err) throw err;
        db.query( // Trae las sucursales activas del JKMT
        "SELECT * FROM VW_SUCURSALES_Y_ZONA", function (err, result) {
          console.log("Cant de registros de sucursales obtenidos:", result.length); //console.log(result);
          // Elimina los espacios en blanco

          var nuevoArray = result.map(function (objeto) {
            return _objectSpread(_objectSpread({}, objeto), {}, {
              ZONA: objeto.ZONA.trimEnd()
            });
          }); //console.log(nuevoArray);

          todasSucursalesActivas = nuevoArray; //console.log("sucursales activas", todasSucursalesActivas);
          // IMPORTANTE: cerrar la conexion

          db.detach();
          resolve();
        });
      });
    });
  } // TRAE LA COBRANZA DE LAS SUCURSALES ACUMULADAS DEL MES ACTUAL


  function getAcumuladosMesAct() {
    console.log("Obteninendo Acumulados Mes Actual...");
    var todasSucursalesReporte = [];
    return new Promise(function (resolve, reject) {
      Firebird.attach(odontos, function (err, db) {
        if (err) throw err;
        db.query( // QUERY
        //"SELECT * FROM PROC_PANEL_ING_ACUM_MESACT (CURRENT_DATE, CURRENT_DATE)",
        // MANUAL
        "SELECT * FROM PROC_PANEL_ING_ACUM_MESACT_2 ('".concat(fechaConsulta, "', '").concat(fechaConsulta, "')"), function (err, result) {
          console.log("Cant de registros obtenidos getAcumuladoMesAct:", result.length); //console.log(result);
          // Se cargan todas las sucursales que trajo la consulta

          var _iterator = _createForOfIteratorHelper(result),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var r = _step.value;

              if (!todasSucursalesReporte.includes(r.SUCURSAL)) {
                todasSucursalesReporte.push(r.SUCURSAL);
              }
            } //console.log(todasSucursalesReporte);
            // Checkea las sucursales que no estan en la lista
            // Si no esta se crea el objeto y carga en el array

          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          var _iterator2 = _createForOfIteratorHelper(todasSucursalesActivas),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var su = _step2.value;

              if (!todasSucursalesReporte.includes(su.NOMBRE)) {
                var objSucursalFaltante = {
                  SUCURSAL: su.NOMBRE,
                  CONCEPTO: "TRATAMIENTO",
                  MONTO: 0
                };
                result.push(objSucursalFaltante); //console.log("Sucursales que NO estan", su.NOMBRE);
              }
            } //console.log('RESULT AHORA', result);
            // SE FORMATEA EL ARRAY COMO PARA INSERTAR EN EL POSTGRESQL

          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          var nuevoArray = result.reduce(function (acumulador, objeto) {
            var index = acumulador.findIndex(function (item) {
              return item.SUCURSAL === objeto.SUCURSAL;
            });

            if (index === -1) {
              acumulador.push({
                FECHA: fechaConsulta,
                SUCURSAL: objeto.SUCURSAL,
                CUOTA_SOCIAL: objeto.CONCEPTO === "CUOTA SOCIAL       " ? objeto.MONTO : 0,
                TRATAMIENTO: objeto.CONCEPTO === "TRATAMIENTO        " ? objeto.MONTO : 0,
                COBRADOR: objeto.CONCEPTO === "REND COBRADOR      " ? objeto.MONTO : 0,
                VENTA_NUEVA: objeto.CONCEPTO === "VENTA NUEVA        " ? objeto.MONTO : 0,
                MONTO_TOTAL: objeto.MONTO,
                user_id: 1
              });
            } else {
              acumulador[index].CUOTA_SOCIAL += objeto.CONCEPTO === "CUOTA SOCIAL       " ? objeto.MONTO : 0;
              acumulador[index].TRATAMIENTO += objeto.CONCEPTO === "TRATAMIENTO        " ? objeto.MONTO : 0;
              acumulador[index].COBRADOR += objeto.CONCEPTO === "REND COBRADOR      " ? objeto.MONTO : 0;
              acumulador[index].VENTA_NUEVA += objeto.CONCEPTO === "VENTA NUEVA        " ? objeto.MONTO : 0;
              acumulador[index].MONTO_TOTAL += objeto.MONTO;
            }

            return acumulador;
          }, []); //console.log("Array formateado para insertar en el POSTGRESQL", nuevoArray);
          // Recorre el array que contiene los datos e inserta en la base de postgresql
          // nuevoArray.forEach((e) => {
          //   // Poblar PGSQL
          //   Acumulado_mesact.create(e)
          //     //.then((result) => res.json(result))
          //     .catch((error) => console.log(error.message));
          // });

          var promesas = nuevoArray.map(function (e) {
            return Acumulado_mesact.create(e);
          });
          Promise.all(promesas).then(function (resultados) {
            // Todos los registros se han insertado correctamente en la base de datos
            console.log("Todas las inserciones se completaron con éxito getAcumuladosMesAct."); // Luego de que todas las inserciones se completen, aquí puedes ejecutar tu función de callback.

            resolve(); // IMPORTANTE: cerrar la conexion

            db.detach();
          })["catch"](function (error) {
            console.error("Ocurrió un error en al menos una inserción getAcumuladosMesAct:", error);
          });
        });
      });
    });
  } // TRAE LA COBRANZA DE LAS SUCURSALES ACUMULADAS DEL MES ATERIOR


  function getAcumuladosMesAnt() {
    console.log("Obteninendo Acumulados Mes Anterior...");
    var todasSucursalesReporte = [];
    return new Promise(function (resolve, reject) {
      Firebird.attach(odontos, function (err, db) {
        if (err) throw err;
        db.query( // QUERY
        //"SELECT * FROM PROC_PANEL_ING_ACUM_MESANT (CURRENT_DATE, CURRENT_DATE)",
        // MANUAL
        "SELECT * FROM PROC_PANEL_ING_ACUM_MESANT_2 ('".concat(fechaConsulta, "', '").concat(fechaConsulta, "')"), function (err, result) {
          console.log("Cant de registros obtenidos getAcumuladosMesAnt:", result.length); //console.log(result);
          // Se cargan todas las sucursales que trajo la consulta

          var _iterator3 = _createForOfIteratorHelper(result),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var r = _step3.value;

              if (!todasSucursalesReporte.includes(r.SUCURSAL)) {
                todasSucursalesReporte.push(r.SUCURSAL);
              }
            } //console.log(todasSucursalesReporte);
            // Checkea las sucursales que no estan en la lista
            // Si no esta se crea el objeto y carga en el array

          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }

          var _iterator4 = _createForOfIteratorHelper(todasSucursalesActivas),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var su = _step4.value;

              if (!todasSucursalesReporte.includes(su.NOMBRE)) {
                var objSucursalFaltante = {
                  SUCURSAL: su.NOMBRE,
                  CONCEPTO: "TRATAMIENTO",
                  MONTO: 0
                };
                result.push(objSucursalFaltante); //console.log("Sucursales que NO estan", su.NOMBRE);
              }
            } //console.log('RESULT AHORA', result);
            // SE FORMATEA EL ARRAY COMO PARA INSERTAR EN EL POSTGRESQL

          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }

          var nuevoArray = result.reduce(function (acumulador, objeto) {
            var index = acumulador.findIndex(function (item) {
              return item.SUCURSAL === objeto.SUCURSAL;
            });

            if (index === -1) {
              acumulador.push({
                FECHA: fechaConsulta,
                SUCURSAL: objeto.SUCURSAL,
                CUOTA_SOCIAL: objeto.CONCEPTO === "CUOTA SOCIAL       " ? objeto.MONTO : 0,
                TRATAMIENTO: objeto.CONCEPTO === "TRATAMIENTO        " ? objeto.MONTO : 0,
                COBRADOR: objeto.CONCEPTO === "REND COBRADOR      " ? objeto.MONTO : 0,
                VENTA_NUEVA: objeto.CONCEPTO === "VENTA NUEVA        " ? objeto.MONTO : 0,
                MONTO_TOTAL: objeto.MONTO,
                user_id: 1
              });
            } else {
              acumulador[index].CUOTA_SOCIAL += objeto.CONCEPTO === "CUOTA SOCIAL       " ? objeto.MONTO : 0;
              acumulador[index].TRATAMIENTO += objeto.CONCEPTO === "TRATAMIENTO        " ? objeto.MONTO : 0;
              acumulador[index].COBRADOR += objeto.CONCEPTO === "REND COBRADOR      " ? objeto.MONTO : 0;
              acumulador[index].VENTA_NUEVA += objeto.CONCEPTO === "VENTA NUEVA        " ? objeto.MONTO : 0;
              acumulador[index].MONTO_TOTAL += objeto.MONTO;
            }

            return acumulador;
          }, []); //console.log("Array formateado para insertar en el POSTGRESQL", nuevoArray);
          // Recorre el array que contiene los datos e inserta en la base de postgresql
          // nuevoArray.forEach((e) => {
          //   // Poblar PGSQL
          //   Acumulado_mesant.create(e)
          //     //.then((result) => res.json(result))
          //     .catch((error) => console.log(error.message));
          // });

          var promesas = nuevoArray.map(function (e) {
            return Acumulado_mesant.create(e);
          });
          Promise.all(promesas).then(function (resultados) {
            // Todos los registros se han insertado correctamente en la base de datos
            console.log("Todas las inserciones se completaron con éxito getAcumuladosMesAnt."); // Luego de que todas las inserciones se completen, aquí puedes ejecutar tu función de callback.

            resolve(); // IMPORTANTE: cerrar la conexion

            db.detach();
          })["catch"](function (error) {
            console.error("Ocurrió un error en al menos una inserción getAcumuladosMesAnt:", error);
          });
        });
      });
    });
  } // TRAE LAS COBRANZAS POR TIPO DEL MES ACTUAL


  function getIngresosMesAct() {
    console.log("Obteninendo Ingresos Mes Actual...");
    var todosTiposPagosConsulta = [];
    return new Promise(function (resolve, reject) {
      //console.log("getIngresoMesAct", fechaHoyFormateado);
      Firebird.attach(odontos, function (err, db) {
        if (err) throw err;
        db.query( // QUERY
        //"SELECT * FROM PROC_PANEL_ING_MES_ACTUAL (CURRENT_DATE, CURRENT_DATE)",
        // MANUAL
        "SELECT * FROM PROC_PANEL_ING_MES_ACTUAL_2 ('".concat(fechaConsulta, "', '").concat(fechaConsulta, "')"), function (err, result) {
          console.log("Cant de registros obtenidos getIngresoMesAct:", result.length); //console.log(result);
          // Se carga de los tipos de pagos que trae la consulta

          var _iterator5 = _createForOfIteratorHelper(result),
              _step5;

          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var r = _step5.value;

              if (!todosTiposPagos.includes(r.TIPO)) {
                todosTiposPagos.push(r.TIPO);
              }
            } //console.log(todasSucursalesReporte);
            // Checkea LOS TIPOS que no estan en la lista
            // Si no esta se crea el objeto y carga en el array

          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }

          var _iterator6 = _createForOfIteratorHelper(todosTiposPagos),
              _step6;

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var t = _step6.value;

              if (!todosTiposPagosConsulta.includes(t)) {
                var objTipoPagoFaltante = {
                  TIPO: t,
                  CONCEPTO: "TRATAMIENTO",
                  MONTO: 0
                };
                result.push(objTipoPagoFaltante);
              }
            } //console.log('RESULT AHORA', result);
            // SE FORMATEA EL ARRAY COMO PARA INSERTAR EN EL POSTGRESQL

          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }

          var nuevoArray = result.reduce(function (acumulador, objeto) {
            var index = acumulador.findIndex(function (item) {
              return item.TIPO === objeto.TIPO;
            });

            if (index === -1) {
              acumulador.push({
                FECHA: fechaConsulta,
                TIPO: objeto.TIPO,
                CUOTA_SOCIAL: objeto.CONCEPTO === "CUOTA SOCIAL       " ? objeto.MONTO : 0,
                TRATAMIENTO: objeto.CONCEPTO === "TRATAMIENTO        " ? objeto.MONTO : 0,
                COBRADOR: objeto.CONCEPTO === "REND COBRADOR      " ? objeto.MONTO : 0,
                VENTA_NUEVA: objeto.CONCEPTO === "VENTA NUEVA        " ? objeto.MONTO : 0,
                MONTO_TOTAL: objeto.MONTO,
                user_id: 1
              });
            } else {
              acumulador[index].CUOTA_SOCIAL += objeto.CONCEPTO === "CUOTA SOCIAL       " ? objeto.MONTO : 0;
              acumulador[index].TRATAMIENTO += objeto.CONCEPTO === "TRATAMIENTO        " ? objeto.MONTO : 0;
              acumulador[index].COBRADOR += objeto.CONCEPTO === "REND COBRADOR      " ? objeto.MONTO : 0;
              acumulador[index].VENTA_NUEVA += objeto.CONCEPTO === "VENTA NUEVA        " ? objeto.MONTO : 0;
              acumulador[index].MONTO_TOTAL += objeto.MONTO;
            }

            return acumulador;
          }, []); //console.log("Array formateado para insertar en el POSTGRESQL", nuevoArray);
          // Recorre el array que contiene los datos e inserta en la base de postgresql
          // nuevoArray.forEach((e) => {
          //   // Poblar PGSQL
          //   Ingresos_mesact.create(e)
          //     //.then((result) => res.json(result))
          //     .catch((error) => console.log(error.message));
          // });

          var promesas = nuevoArray.map(function (e) {
            return Ingresos_mesact.create(e);
          });
          Promise.all(promesas).then(function (resultados) {
            // Todos los registros se han insertado correctamente en la base de datos
            console.log("Todas las inserciones se completaron con éxito getIngresoMesAct."); // Luego de que todas las inserciones se completen, aquí puedes ejecutar tu función de callback.

            resolve(); // IMPORTANTE: cerrar la conexion

            db.detach();
          })["catch"](function (error) {
            console.error("Ocurrió un error en al menos una inserción getIngresoMesAct:", error);
          });
        });
      });
    });
  } // TRAE LAS COBRANZAS POR TIPO DEL MES ANTERIOR


  function getIngresosMesAnt() {
    console.log("Obteninendo Ingresos Mes Anterior...");
    var todosTiposPagosConsulta = [];
    return new Promise(function (resolve, reject) {
      //console.log("getIngresoMesAct", fechaHoyFormateado);
      Firebird.attach(odontos, function (err, db) {
        if (err) throw err;
        db.query( // QUERY
        //"SELECT * FROM PROC_PANEL_ING_MES_ANTERIOR (CURRENT_DATE, CURRENT_DATE)",
        // MANUAL
        "SELECT * FROM PROC_PANEL_ING_MES_ANTERIOR_2 ('".concat(fechaConsulta, "', '").concat(fechaConsulta, "')"), function (err, result) {
          console.log("Cant de registros obtenidos getIngresoMesAct:", result.length); //console.log(result);
          // Se carga de los tipos de pagos que trae la consulta

          var _iterator7 = _createForOfIteratorHelper(result),
              _step7;

          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              var r = _step7.value;

              if (!todosTiposPagos.includes(r.TIPO)) {
                todosTiposPagos.push(r.TIPO);
              }
            } //console.log(todasSucursalesReporte);
            // Checkea LOS TIPOS que no estan en la lista
            // Si no esta se crea el objeto y carga en el array

          } catch (err) {
            _iterator7.e(err);
          } finally {
            _iterator7.f();
          }

          var _iterator8 = _createForOfIteratorHelper(todosTiposPagos),
              _step8;

          try {
            for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
              var t = _step8.value;

              if (!todosTiposPagosConsulta.includes(t)) {
                var objTipoPagoFaltante = {
                  TIPO: t,
                  CONCEPTO: "TRATAMIENTO",
                  MONTO: 0
                };
                result.push(objTipoPagoFaltante);
              }
            } //console.log('RESULT AHORA', result);
            // SE FORMATEA EL ARRAY COMO PARA INSERTAR EN EL POSTGRESQL

          } catch (err) {
            _iterator8.e(err);
          } finally {
            _iterator8.f();
          }

          var nuevoArray = result.reduce(function (acumulador, objeto) {
            var index = acumulador.findIndex(function (item) {
              return item.TIPO === objeto.TIPO;
            });

            if (index === -1) {
              acumulador.push({
                FECHA: fechaConsulta,
                TIPO: objeto.TIPO,
                CUOTA_SOCIAL: objeto.CONCEPTO === "CUOTA SOCIAL       " ? objeto.MONTO : 0,
                TRATAMIENTO: objeto.CONCEPTO === "TRATAMIENTO        " ? objeto.MONTO : 0,
                COBRADOR: objeto.CONCEPTO === "REND COBRADOR      " ? objeto.MONTO : 0,
                VENTA_NUEVA: objeto.CONCEPTO === "VENTA NUEVA        " ? objeto.MONTO : 0,
                MONTO_TOTAL: objeto.MONTO,
                user_id: 1
              });
            } else {
              acumulador[index].CUOTA_SOCIAL += objeto.CONCEPTO === "CUOTA SOCIAL       " ? objeto.MONTO : 0;
              acumulador[index].TRATAMIENTO += objeto.CONCEPTO === "TRATAMIENTO        " ? objeto.MONTO : 0;
              acumulador[index].COBRADOR += objeto.CONCEPTO === "REND COBRADOR      " ? objeto.MONTO : 0;
              acumulador[index].VENTA_NUEVA += objeto.CONCEPTO === "VENTA NUEVA        " ? objeto.MONTO : 0;
              acumulador[index].MONTO_TOTAL += objeto.MONTO;
            }

            return acumulador;
          }, []); //console.log("Array formateado para insertar en el POSTGRESQL", nuevoArray);
          // Recorre el array que contiene los datos e inserta en la base de postgresql
          // nuevoArray.forEach((e) => {
          //   // Poblar PGSQL
          //   Ingresos_mesant.create(e)
          //     //.then((result) => res.json(result))
          //     .catch((error) => console.log(error.message));
          // });

          var promesas = nuevoArray.map(function (e) {
            return Ingresos_mesant.create(e);
          });
          Promise.all(promesas).then(function (resultados) {
            // Todos los registros se han insertado correctamente en la base de datos
            console.log("Todas las inserciones se completaron con éxito getIngresoMesAnt."); // Luego de que todas las inserciones se completen, aquí puedes ejecutar tu función de callback.

            resolve(); // IMPORTANTE: cerrar la conexion

            db.detach();
          })["catch"](function (error) {
            console.error("Ocurrió un error en al menos una inserción getIngresoMesAnt:", error);
          });
        });
      });
    });
  } // TESTING - EJECUCION MANUAL


  iniciarConsultas().then(function () {
    return getSucursalesActivas();
  }).then(function () {
    return getAcumuladosMesAct();
  }).then(function () {
    return getAcumuladosMesAnt();
  }).then(function () {
    return getIngresosMesAct();
  }).then(function () {
    return getIngresosMesAnt();
  }).then(function () {
    console.log("Se realizaron todas las consultas...");
  }).then(function () {
    console.log("Llama a la funcion iniciar envio");
    iniciarEnvio();
  })["catch"](function (error) {
    console.error("Ocurrio un error:", error);
  }); // Inicia los envios - Consulta al PGSQL

  var losAcumuladosMesAct = [];
  var losAcumuladosMesActForma = [];
  var losAcumuladosMesAnt = [];
  var losAcumuladosMesAntForma = [];
  var losIngresosMesAct = [];
  var losIngresosMesAnt = []; // Sub Totales Zona Asuncion

  var sumTotalesAsuncionCS = 0;
  var sumTotalesAsuncionTT = 0;
  var sumTotalesAsuncionCO = 0;
  var sumTotalesAsuncionVN = 0;
  var sumTotalesAsuncionMT = 0;
  var sumTotalesAsuncionCS_ = 0;
  var sumTotalesAsuncionTT_ = 0;
  var sumTotalesAsuncionCO_ = 0;
  var sumTotalesAsuncionVN_ = 0;
  var sumTotalesAsuncionMT_ = 0; // Sub Totales Zona Gran Asuncion

  var sumTotalesGAsuncionCS = 0;
  var sumTotalesGAsuncionTT = 0;
  var sumTotalesGAsuncionCO = 0;
  var sumTotalesGAsuncionVN = 0;
  var sumTotalesGAsuncionMT = 0;
  var sumTotalesGAsuncionCS_ = 0;
  var sumTotalesGAsuncionTT_ = 0;
  var sumTotalesGAsuncionCO_ = 0;
  var sumTotalesGAsuncionVN_ = 0;
  var sumTotalesGAsuncionMT_ = 0; // Sub Totales Zona Ruta 2

  var sumTotalesR2CS = 0;
  var sumTotalesR2TT = 0;
  var sumTotalesR2CO = 0;
  var sumTotalesR2VN = 0;
  var sumTotalesR2MT = 0;
  var sumTotalesR2CS_ = 0;
  var sumTotalesR2TT_ = 0;
  var sumTotalesR2CO_ = 0;
  var sumTotalesR2VN_ = 0;
  var sumTotalesR2MT_ = 0; // Sub Totales Zona Itapua

  var sumTotalesItaCS = 0;
  var sumTotalesItaTT = 0;
  var sumTotalesItaCO = 0;
  var sumTotalesItaVN = 0;
  var sumTotalesItaMT = 0;
  var sumTotalesItaCS_ = 0;
  var sumTotalesItaTT_ = 0;
  var sumTotalesItaCO_ = 0;
  var sumTotalesItaVN_ = 0;
  var sumTotalesItaMT_ = 0; // Sub Totales Zona Alto Parana

  var sumTotalesApCS = 0;
  var sumTotalesApTT = 0;
  var sumTotalesApCO = 0;
  var sumTotalesApVN = 0;
  var sumTotalesApMT = 0;
  var sumTotalesApCS_ = 0;
  var sumTotalesApTT_ = 0;
  var sumTotalesApCO_ = 0;
  var sumTotalesApVN_ = 0;
  var sumTotalesApMT_ = 0; // Sub Totales Zona San Pedro

  var sumTotalesSpCS = 0;
  var sumTotalesSpTT = 0;
  var sumTotalesSpCO = 0;
  var sumTotalesSpVN = 0;
  var sumTotalesSpMT = 0;
  var sumTotalesSpCS_ = 0;
  var sumTotalesSpTT_ = 0;
  var sumTotalesSpCO_ = 0;
  var sumTotalesSpVN_ = 0;
  var sumTotalesSpMT_ = 0; // Totales Generales

  var totalGenCuotaSocial = 0;
  var totalGenTratamiento = 0;
  var totalGenCobrador = 0;
  var totalGenVentaNueva = 0;
  var totalGenMontoTotal = 0;
  var totalGenINCuotaSocial = 0;
  var totalGenINTratamiento = 0;
  var totalGenINCobrador = 0;
  var totalGenINVentaNueva = 0;
  var totalGenINMontoTotal = 0;
  var totalGenCuotaSocial_ = 0;
  var totalGenTratamiento_ = 0;
  var totalGenCobrador_ = 0;
  var totalGenVentaNueva_ = 0;
  var totalGenMontoTotal_ = 0;
  var totalGenINCuotaSocial_ = 0;
  var totalGenINTratamiento_ = 0;
  var totalGenINCobrador_ = 0;
  var totalGenINVentaNueva_ = 0;
  var totalGenINMontoTotal_ = 0;

  function iniciarEnvio() {
    return new Promise(function (resolve, reject) {
      // Datos acumulados del mes Anterior
      Acumulado_mesant.findAll({
        where: {
          FECHA: fechaConsulta
        } //order: [["createdAt", "ASC"]],

      }).then(function (result) {
        losAcumuladosMesAnt = result;
        console.log("Datos Acum Mesant :", losAcumuladosMesAnt.length);
        losAcumuladosMesAntForma = result.map(function (objeto) {
          return _objectSpread(_objectSpread({}, objeto), {}, {
            FECHA: fechaConsulta,
            SUCURSAL: objeto.SUCURSAL,
            CUOTA_SOCIAL: objeto.CUOTA_SOCIAL !== "0" ? parseFloat(objeto.CUOTA_SOCIAL).toLocaleString("es", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }) : objeto.CUOTA_SOCIAL,
            TRATAMIENTO: objeto.TRATAMIENTO !== "0" ? parseFloat(objeto.TRATAMIENTO).toLocaleString("es", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }) : objeto.TRATAMIENTO,
            COBRADOR: objeto.COBRADOR !== "0" ? parseFloat(objeto.COBRADOR).toLocaleString("es", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }) : objeto.COBRADOR,
            VENTA_NUEVA: objeto.VENTA_NUEVA !== "0" ? parseFloat(objeto.VENTA_NUEVA).toLocaleString("es", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }) : objeto.VENTA_NUEVA,
            MONTO_TOTAL: objeto.MONTO_TOTAL !== "0" ? parseFloat(objeto.MONTO_TOTAL).toLocaleString("es", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }) : objeto.MONTO_TOTAL
          });
        }); // Datos ingresos mes Anterior

        Ingresos_mesant.findAll({
          where: {
            FECHA: fechaConsulta
          } //order: [["createdAt", "ASC"]],

        }).then(function (result) {
          losIngresosMesAnt = result;
          console.log("Datos Ing Mesant :", losIngresosMesAnt.length); // Funcion que suma los montos totales - Acumulados e Ingresos de mes Anterior

          sumarMontosMesAnterior(losAcumuladosMesAnt);
        })["catch"](function (error) {
          res.status(402).json({
            msg: error.menssage
          });
        });
      })["catch"](function (error) {
        res.status(402).json({
          msg: error.menssage
        });
      }); // Datos del mes Actual

      Acumulado_mesact.findAll({
        where: {
          FECHA: fechaConsulta
        } //order: [["createdAt", "ASC"]],

      }).then(function (result) {
        losAcumuladosMesAct = result;
        console.log("Datos Acum Mesact:", losAcumuladosMesAct.length);
        losAcumuladosMesActForma = result.map(function (objeto) {
          return _objectSpread(_objectSpread({}, objeto), {}, {
            FECHA: fechaConsulta,
            SUCURSAL: objeto.SUCURSAL,
            CUOTA_SOCIAL: objeto.CUOTA_SOCIAL !== "0" ? parseFloat(objeto.CUOTA_SOCIAL).toLocaleString("es", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }) : objeto.CUOTA_SOCIAL,
            TRATAMIENTO: objeto.TRATAMIENTO !== "0" ? parseFloat(objeto.TRATAMIENTO).toLocaleString("es", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }) : objeto.TRATAMIENTO,
            COBRADOR: objeto.COBRADOR !== "0" ? parseFloat(objeto.COBRADOR).toLocaleString("es", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }) : objeto.COBRADOR,
            VENTA_NUEVA: objeto.VENTA_NUEVA !== "0" ? parseFloat(objeto.VENTA_NUEVA).toLocaleString("es", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }) : objeto.VENTA_NUEVA,
            MONTO_TOTAL: objeto.MONTO_TOTAL !== "0" ? parseFloat(objeto.MONTO_TOTAL).toLocaleString("es", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }) : objeto.MONTO_TOTAL
          });
        }); // Datos ingresos mes Actual

        Ingresos_mesact.findAll({
          where: {
            FECHA: fechaConsulta
          } //order: [["createdAt", "ASC"]],

        }).then(function (result) {
          losIngresosMesAct = result;
          console.log("Datos Ing Mesact :", losIngresosMesAct.length); // Funcion que suma los montos totales Acumulados e Ingresos de mes Actual

          sumarMontosMesActual(losAcumuladosMesAct);
        })["catch"](function (error) {
          res.status(402).json({
            msg: error.menssage
          });
        });
      })["catch"](function (error) {
        res.status(402).json({
          msg: error.menssage
        });
      });
      setTimeout(function () {
        calcularDiferencias();
        console.log('Se calculan las diferencias...');
      }, 10000);
      setTimeout(function () {
        enviarMensaje();
        resolve();
      }, 15000);
    });
  } // Habilitar para testing
  //iniciarEnvio();
  // Diferencias de montos


  var totalAdministracion = 0;
  var totalAdministracion_ = 0;
  var totalDifAdministracion = 0;
  var totalML = 0;
  var totalML_ = 0;
  var totalDifML = 0;
  var totalMLU = 0;
  var totalMLU_ = 0;
  var totalDifMLU = 0;
  var totalAQ = 0;
  var totalAQ_ = 0;
  var totalDifAQ = 0;
  var totalVM = 0;
  var totalVM_ = 0;
  var totalDifVM = 0;
  var totalART = 0;
  var totalART_ = 0;
  var totalDifART = 0;
  var totalLUI = 0;
  var totalLUI_ = 0;
  var totalDifLUI = 0;
  var totalPAL = 0;
  var totalPAL_ = 0;
  var totalDifPAL = 0;
  var totalLAM = 0;
  var totalLAM_ = 0;
  var totalDifLAM = 0;
  var totalCAT = 0;
  var totalCAT_ = 0;
  var totalDifCAT = 0;
  var totalLUQ = 0;
  var totalLUQ_ = 0;
  var totalDifLUQ = 0;
  var totalLAR = 0;
  var totalLAR_ = 0;
  var totalDifLAR = 0;
  var totalNEM = 0;
  var totalNEM_ = 0;
  var totalDifNEM = 0;
  var totalITA = 0;
  var totalITA_ = 0;
  var totalDifITA = 0;
  var total1811 = 0;
  var total1811_ = 0;
  var totalDif1811 = 0;
  var totalKM14 = 0;
  var totalKM14_ = 0;
  var totalDifKM14 = 0;
  var totalCAP = 0;
  var totalCAP_ = 0;
  var totalDifCAP = 0;
  var totalCAACU = 0;
  var totalCAACU_ = 0;
  var totalDifCAACU = 0;
  var totalCORO = 0;
  var totalCORO_ = 0;
  var totalDifCORO = 0;
  var totalHOHE = 0;
  var totalHOHE_ = 0;
  var totalDifHOHE = 0;
  var totalENCAR = 0;
  var totalENCAR_ = 0;
  var totalDifENCAR = 0;
  var totalMARAUX = 0;
  var totalMARAUX_ = 0;
  var totalDifMARAUX = 0;
  var totalAYO = 0;
  var totalAYO_ = 0;
  var totalDifAYO = 0;
  var totalKM7 = 0;
  var totalKM7_ = 0;
  var totalDifKM7 = 0;
  var totalSANRIT = 0;
  var totalSANRIT_ = 0;
  var totalDifSANRIT = 0;
  var totalCAM9 = 0;
  var totalCAM9_ = 0;
  var totalDifCAM9 = 0;
  var totalSANTANI = 0;
  var totalSANTANI_ = 0;
  var totalDifSANTANI = 0;
  var totalPagosElectronicos = 0;
  var totalPagosElectronicos_ = 0;
  var totalDifPagoElectronico = 0;
  var totalAsoDeb = 0;
  var totalAsoDeb_ = 0;
  var totalDifAsoDeb = 0;
  var totalLicitaciones = 0;
  var totalLicitaciones_ = 0;
  var totalDifLicitaciones = 0;
  var totalTransGirosPalma = 0;
  var totalTransGirosPalma_ = 0;
  var totalDifTransGirosPalma = 0;
  var totalDifTotalADM = 0;
  var difTotalesAsuncionMT = 0;
  var difTotalesGAsuncionMT = 0;
  var difTotalesR2MT = 0;
  var difTotalesItaMT = 0;
  var difTotalesApMT = 0;
  var difTotalesSpMT = 0; // Sumar montos de acumulados mes anterior

  function sumarMontosMesAnterior(los_acumulados_mes_ant) {
    var arrayAsuncion = ["ADMINISTRACION", "MARISCAL LOPEZ", "MCAL. LOPEZ URGENCIAS", "AVENIDA QUINTA", "VILLA MORRA", "ARTIGAS", "LUISITO", "PALMA"];
    var arrayGAsuncion = ["LAMBARE", "CATEDRAL", "LUQUE", "LA RURAL", "ÑEMBY", "ITAUGUA", "1811 SUCURSAL", "KM 14 Y MEDIO", "CAPIATA"];
    var arrayRuta2 = ["CAACUPE", "CORONEL OVIEDO"];
    var arrayItapua = ["HOHENAU", "ENCARNACION CENTRO", "MARIA AUXILIADORA", "AYOLAS"];
    var arrayAltop = ["KM 7", "SANTA RITA", "CAMPO 9"];
    var arraySanpe = ["SANTANI"]; //console.log('DESDE SUMAR MONTOS');

    var _iterator9 = _createForOfIteratorHelper(los_acumulados_mes_ant),
        _step9;

    try {
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        var r = _step9.value;

        // Suma los montos de los acumulados mes anterior
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
      } // Totales Generales mes anterior

    } catch (err) {
      _iterator9.e(err);
    } finally {
      _iterator9.f();
    }

    totalGenCuotaSocial = sumTotalesAsuncionCS + sumTotalesGAsuncionCS + sumTotalesR2CS + sumTotalesItaCS + sumTotalesApCS + sumTotalesSpCS;
    totalGenTratamiento = sumTotalesAsuncionTT + sumTotalesGAsuncionTT + sumTotalesR2TT + sumTotalesItaTT + sumTotalesApTT + sumTotalesSpTT;
    totalGenCobrador = sumTotalesAsuncionCO + sumTotalesGAsuncionCO + sumTotalesR2CO + sumTotalesItaCO + sumTotalesApCO + sumTotalesSpCO;
    totalGenVentaNueva = sumTotalesAsuncionVN + sumTotalesGAsuncionVN + sumTotalesR2VN + sumTotalesItaVN + sumTotalesApVN + sumTotalesSpVN;
    totalGenMontoTotal = sumTotalesAsuncionMT + sumTotalesGAsuncionMT + sumTotalesR2MT + sumTotalesItaMT + sumTotalesApMT + sumTotalesSpMT; // Suma las cantidades de los ingresos mes anterior

    var _iterator10 = _createForOfIteratorHelper(losIngresosMesAnt),
        _step10;

    try {
      for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
        var t = _step10.value;
        // Totales generales
        totalGenINCuotaSocial += parseInt(t.CUOTA_SOCIAL);
        totalGenINTratamiento += parseInt(t.TRATAMIENTO);
        totalGenINCobrador += parseInt(t.COBRADOR);
        totalGenINVentaNueva += parseInt(t.VENTA_NUEVA);
        totalGenINMontoTotal += parseInt(t.MONTO_TOTAL); // Totales por TIPO

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
    } catch (err) {
      _iterator10.e(err);
    } finally {
      _iterator10.f();
    }
  } // Sumar montos de acumulados mes actual


  function sumarMontosMesActual(los_acumulados_mes_act) {
    var arrayAsuncion = ["ADMINISTRACION", "MARISCAL LOPEZ", "MCAL. LOPEZ URGENCIAS", "AVENIDA QUINTA", "VILLA MORRA", "ARTIGAS", "LUISITO", "PALMA"];
    var arrayGAsuncion = ["LAMBARE", "CATEDRAL", "LUQUE", "LA RURAL", "ÑEMBY", "ITAUGUA", "1811 SUCURSAL", "KM 14 Y MEDIO", "CAPIATA"];
    var arrayRuta2 = ["CAACUPE", "CORONEL OVIEDO"];
    var arrayItapua = ["HOHENAU", "ENCARNACION CENTRO", "MARIA AUXILIADORA", "AYOLAS"];
    var arrayAltop = ["KM 7", "SANTA RITA", "CAMPO 9"];
    var arraySanpe = ["SANTANI"]; //console.log('DESDE SUMAR MONTOS', los_acumulados_mes_ant.length);

    var _iterator11 = _createForOfIteratorHelper(los_acumulados_mes_act),
        _step11;

    try {
      for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
        var r = _step11.value;

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
      } // Totales Generales mes actual

    } catch (err) {
      _iterator11.e(err);
    } finally {
      _iterator11.f();
    }

    totalGenCuotaSocial_ = sumTotalesAsuncionCS_ + sumTotalesGAsuncionCS_ + sumTotalesR2CS_ + sumTotalesItaCS_ + sumTotalesApCS_ + sumTotalesSpCS_;
    totalGenTratamiento_ = sumTotalesAsuncionTT_ + sumTotalesGAsuncionTT_ + sumTotalesR2TT_ + sumTotalesItaTT_ + sumTotalesApTT_ + sumTotalesSpTT_;
    totalGenCobrador_ = sumTotalesAsuncionCO_ + sumTotalesGAsuncionCO_ + sumTotalesR2CO_ + sumTotalesItaCO_ + sumTotalesApCO_ + sumTotalesSpCO_;
    totalGenVentaNueva_ = sumTotalesAsuncionVN_ + sumTotalesGAsuncionVN_ + sumTotalesR2VN_ + sumTotalesItaVN_ + sumTotalesApVN_ + sumTotalesSpVN_;
    totalGenMontoTotal_ = sumTotalesAsuncionMT_ + sumTotalesGAsuncionMT_ + sumTotalesR2MT_ + sumTotalesItaMT_ + sumTotalesApMT_ + sumTotalesSpMT_; // Suma las cantidades de los ingresos mes actual

    var _iterator12 = _createForOfIteratorHelper(losIngresosMesAct),
        _step12;

    try {
      for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
        var t = _step12.value;
        totalGenINCuotaSocial_ += parseInt(t.CUOTA_SOCIAL);
        totalGenINTratamiento_ += parseInt(t.TRATAMIENTO);
        totalGenINCobrador_ += parseInt(t.COBRADOR);
        totalGenINVentaNueva_ += parseInt(t.VENTA_NUEVA);
        totalGenINMontoTotal_ += parseInt(t.MONTO_TOTAL); // Totales por TIPO

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
    } catch (err) {
      _iterator12.e(err);
    } finally {
      _iterator12.f();
    }
  } // Se calculan las diferencias


  function calcularDiferencias() {
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
  } // Define el color del texto segun el monto


  function colorSegunMonto(monto) {
    var colorText = "green";

    if (monto < 0) {
      colorText = "red";
    }

    return colorText;
  } // Se dibuja la Imagen - Envia los mensajes


  var retraso = function retraso() {
    return new Promise(function (r) {
      return setTimeout(r, tiempoRetrasoEnvios);
    });
  };

  function enviarMensaje() {
    return _enviarMensaje.apply(this, arguments);
  }

  function _enviarMensaje() {
    _enviarMensaje = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log("Inicia el recorrido del for para dibujar y enviar el reporte"); // Dibuja la imagen

              loadImage(imagePath).then(function (image) {
                // Dibuja la imagen de fondo
                context.drawImage(image, 0, 0, width, height); // Eje X e Y de las fechas

                var ejeXFechaAnt = 700;
                var ejeXFechaAct = 1330;
                var ejeYFechaAnt = 115;
                var ejeYFechaAct = 115; // Eje X de cada celda

                var ejeXsucu = 27;
                var ejeXcuota = 385;
                var ejeXtrata = 530;
                var ejeXcobra = 660;
                var ejeXventa = 760;
                var ejeXmonto = 910;
                var ejeXcuota_ = 1035;
                var ejeXtrata_ = 1160;
                var ejeXcobra_ = 1280;
                var ejeXventa_ = 1390;
                var ejeXmonto_ = 1520;
                var ejeXdiferencia_ = 1650; // Eje Y de cada fila

                var ejeYadm = 194;
                var ejeYml = 218;
                var ejeYmlurg = 238;
                var ejeYaq = 258;
                var ejeYvm = 278;
                var ejeYar = 298;
                var ejeYlu = 318;
                var ejeYpa = 338;
                var ejeYtotalesAsu = 358;
                var ejeYlam = 388;
                var ejeYcat = 408;
                var ejeYluq = 428;
                var ejeYlar = 448;
                var ejeYnem = 468;
                var ejeYita = 488;
                var ejeY1811 = 508;
                var ejeYkm14 = 528;
                var ejeYcap = 548;
                var ejeYtotalesGranAsu = 568;
                var ejeYcaac = 598;
                var ejeYcoro = 618;
                var ejeYtotalesRuta2 = 638;
                var ejeYhohe = 668;
                var ejeYencar = 688;
                var ejeYmaria = 708;
                var ejeYayo = 728;
                var ejeYtotalesItapua = 748;
                var ejeYkm7 = 778;
                var ejeYsanta = 798;
                var ejeYcampo = 818;
                var ejeYtotalesAltoP = 838;
                var ejeYsantani = 868;
                var ejeYtotalesSanPe = 888; // Eje Y Total Sucursales

                var ejeYTotalGeneral = 928; // Eje Y Ingresos

                var ejeYPagosElectronicos = 968;
                var ejeYAsoDebito = 988;
                var ejeYLicitacion = 1008;
                var ejeYTransGirosPalma = 1028;
                var ejeYTotalADM = 1048;
                var ejeYtotalGeneralDoc = 1088; // Dibujar el cuadro de mes anterior

                var _iterator13 = _createForOfIteratorHelper(losAcumuladosMesAntForma),
                    _step13;

                try {
                  for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
                    var r = _step13.value;

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
                    } // Zona Gran ASU


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
                    } // Zona Ruta 2


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
                    } // Zona Itapua


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
                    } // Zona Alto Parana


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
                    } // Zona San Pedro


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
                  } // Recorre los ingresos de mes anterior

                } catch (err) {
                  _iterator13.e(err);
                } finally {
                  _iterator13.f();
                }

                var _iterator14 = _createForOfIteratorHelper(losIngresosMesAnt),
                    _step14;

                try {
                  for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
                    var _r = _step14.value;

                    if (_r.TIPO == "PAGOS ELECTRONICOS") {
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "left";
                      context.fillText(_r.TIPO, ejeXsucu, ejeYPagosElectronicos);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.CUOTA_SOCIAL).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXcuota, ejeYPagosElectronicos);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.TRATAMIENTO).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXtrata, ejeYPagosElectronicos);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.COBRADOR).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXcobra, ejeYPagosElectronicos);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.VENTA_NUEVA).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXventa, ejeYPagosElectronicos);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.MONTO_TOTAL).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXmonto, ejeYPagosElectronicos);
                    }

                    if (_r.TIPO == "ASO. DEB.") {
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "left";
                      context.fillText(_r.TIPO, ejeXsucu, ejeYAsoDebito);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.CUOTA_SOCIAL).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXcuota, ejeYAsoDebito);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.TRATAMIENTO).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXtrata, ejeYAsoDebito);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.COBRADOR).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXcobra, ejeYAsoDebito);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.VENTA_NUEVA).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXventa, ejeYAsoDebito);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.MONTO_TOTAL).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXmonto, ejeYAsoDebito);
                    }

                    if (_r.TIPO == "LICITACIONES") {
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "left";
                      context.fillText(_r.TIPO, ejeXsucu, ejeYLicitacion);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.CUOTA_SOCIAL).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXcuota, ejeYLicitacion);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.TRATAMIENTO).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXtrata, ejeYLicitacion);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.COBRADOR).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXcobra, ejeYLicitacion);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.VENTA_NUEVA).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXventa, ejeYLicitacion);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.MONTO_TOTAL).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXmonto, ejeYLicitacion);
                    }

                    if (_r.TIPO == "TRANSF. GIROS PALMA") {
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "left";
                      context.fillText(_r.TIPO, ejeXsucu, ejeYTransGirosPalma);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.CUOTA_SOCIAL).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXcuota, ejeYTransGirosPalma);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.TRATAMIENTO).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXtrata, ejeYTransGirosPalma);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.COBRADOR).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXcobra, ejeYTransGirosPalma);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.VENTA_NUEVA).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXventa, ejeYTransGirosPalma);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r.MONTO_TOTAL).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXmonto, ejeYTransGirosPalma);
                    }
                  } // Dibujar el cuadro de mes actual

                } catch (err) {
                  _iterator14.e(err);
                } finally {
                  _iterator14.f();
                }

                var _iterator15 = _createForOfIteratorHelper(losAcumuladosMesActForma),
                    _step15;

                try {
                  for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
                    var _r2 = _step15.value;

                    // Zona ASU
                    if (_r2.SUCURSAL == "ADMINISTRACION") {
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYadm);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYadm);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYadm);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYadm);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYadm);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifAdministracion);
                      context.textAlign = "right";
                      context.fillText(totalDifAdministracion.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYadm);
                    }

                    if (_r2.SUCURSAL == "MARISCAL LOPEZ") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYml);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYml);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYml);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYml);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYml);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifML);
                      context.textAlign = "right";
                      context.fillText(totalDifML.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYml);
                    }

                    if (_r2.SUCURSAL == "MCAL. LOPEZ URGENCIAS") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYmlurg);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYmlurg);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYmlurg);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYmlurg);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYmlurg);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifMLU);
                      context.textAlign = "right";
                      context.fillText(totalDifMLU.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYmlurg);
                    }

                    if (_r2.SUCURSAL == "AVENIDA QUINTA") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYaq);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYaq);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYaq);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYaq);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYaq);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifAQ);
                      context.textAlign = "right";
                      context.fillText(totalDifAQ.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYaq);
                    }

                    if (_r2.SUCURSAL == "VILLA MORRA") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYvm);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYvm);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYvm);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYvm);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYvm);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifVM);
                      context.textAlign = "right";
                      context.fillText(totalDifVM.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYvm);
                    }

                    if (_r2.SUCURSAL == "ARTIGAS") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYar);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYar);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYar);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYar);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYar);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifART);
                      context.textAlign = "right";
                      context.fillText(totalDifART.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYar);
                    }

                    if (_r2.SUCURSAL == "LUISITO") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYlu);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYlu);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYlu);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYlu);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYlu);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifLUI);
                      context.textAlign = "right";
                      context.fillText(totalDifLUI.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYlu);
                    }

                    if (_r2.SUCURSAL == "PALMA") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYpa);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYpa);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYpa);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYpa);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYpa);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifPAL);
                      context.textAlign = "right";
                      context.fillText(totalDifPAL.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYpa);
                    } // Zona Gran ASU


                    if (_r2.SUCURSAL == "LAMBARE") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYlam);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYlam);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYlam);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYlam);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYlam);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifLAM);
                      context.textAlign = "right";
                      context.fillText(totalDifLAM.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYlam);
                    }

                    if (_r2.SUCURSAL == "CATEDRAL") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYcat);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYcat);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYcat);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYcat);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYcat);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifCAT);
                      context.textAlign = "right";
                      context.fillText(totalDifCAT.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYcat);
                    }

                    if (_r2.SUCURSAL == "LUQUE") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYluq);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYluq);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYluq);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYluq);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYluq);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifLUQ);
                      context.textAlign = "right";
                      context.fillText(totalDifLUQ.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYluq);
                    }

                    if (_r2.SUCURSAL == "LA RURAL") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYlar);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYlar);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYlar);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYlar);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYlar);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifLAR);
                      context.textAlign = "right";
                      context.fillText(totalDifLAR.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYlar);
                    }

                    if (_r2.SUCURSAL == "ÑEMBY") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYnem);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYnem);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYnem);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYnem);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYnem);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifNEM);
                      context.textAlign = "right";
                      context.fillText(totalDifNEM.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYnem);
                    }

                    if (_r2.SUCURSAL == "ITAUGUA") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYita);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYita);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYita);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYita);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYita);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifITA);
                      context.textAlign = "right";
                      context.fillText(totalDifITA.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYita);
                    }

                    if (_r2.SUCURSAL == "1811 SUCURSAL") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeY1811);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeY1811);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeY1811);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeY1811);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeY1811);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDif1811);
                      context.textAlign = "right";
                      context.fillText(totalDif1811.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeY1811);
                    }

                    if (_r2.SUCURSAL == "KM 14 Y MEDIO") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYkm14);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYkm14);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYkm14);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYkm14);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYkm14);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifKM14);
                      context.textAlign = "right";
                      context.fillText(totalDifKM14.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYkm14);
                    }

                    if (_r2.SUCURSAL == "CAPIATA") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYcap);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYcap);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYcap);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYcap);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYcap);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifCAP);
                      context.textAlign = "right";
                      context.fillText(totalDifCAP.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYcap);
                    } // Zona Ruta 2


                    if (_r2.SUCURSAL == "CAACUPE") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYcaac);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYcaac);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYcaac);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYcaac);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYcaac);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifCAACU);
                      context.textAlign = "right";
                      context.fillText(totalDifCAACU.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYcaac);
                    }

                    if (_r2.SUCURSAL == "CORONEL OVIEDO") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYcoro);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYcoro);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYcoro);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYcoro);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYcoro);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifCORO);
                      context.textAlign = "right";
                      context.fillText(totalDifCORO.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYcoro);
                    } // Zona Itapua


                    if (_r2.SUCURSAL == "HOHENAU") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYhohe);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYhohe);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYhohe);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYhohe);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYhohe);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifHOHE);
                      context.textAlign = "right";
                      context.fillText(totalDifHOHE.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYhohe);
                    }

                    if (_r2.SUCURSAL == "ENCARNACION CENTRO") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYencar);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYencar);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYencar);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYencar);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYencar);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifENCAR);
                      context.textAlign = "right";
                      context.fillText(totalDifENCAR.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYencar);
                    }

                    if (_r2.SUCURSAL == "MARIA AUXILIADORA") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYmaria);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYmaria);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYmaria);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYmaria);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYmaria);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifMARAUX);
                      context.textAlign = "right";
                      context.fillText(totalDifMARAUX.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYmaria);
                    }

                    if (_r2.SUCURSAL == "AYOLAS") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYayo);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYayo);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYayo);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYayo);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYayo);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifAYO);
                      context.textAlign = "right";
                      context.fillText(totalDifAYO.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYayo);
                    } // Zona Alto Parana


                    if (_r2.SUCURSAL == "KM 7") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYkm7);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYkm7);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYkm7);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYkm7);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYkm7);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifKM7);
                      context.textAlign = "right";
                      context.fillText(totalDifKM7.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYkm7);
                    }

                    if (_r2.SUCURSAL == "SANTA RITA") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYsanta);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYsanta);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYsanta);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYsanta);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYsanta);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifSANRIT);
                      context.textAlign = "right";
                      context.fillText(totalDifSANRIT.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYsanta);
                    }

                    if (_r2.SUCURSAL == "CAMPO 9") {
                      // Se dibuja los datos acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYcampo);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYcampo);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYcampo);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYcampo);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYcampo);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifCAM9);
                      context.textAlign = "right";
                      context.fillText(totalDifCAM9.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYcampo);
                    } // Zona San Pedro


                    if (_r2.SUCURSAL == "SANTANI") {
                      // Se dibuja los datos del acumulado mes actual
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.CUOTA_SOCIAL, ejeXcuota_, ejeYsantani);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.TRATAMIENTO, ejeXtrata_, ejeYsantani);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.COBRADOR, ejeXcobra_, ejeYsantani);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.VENTA_NUEVA, ejeXventa_, ejeYsantani);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(_r2.MONTO_TOTAL, ejeXmonto_, ejeYsantani);
                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifSANTANI);
                      context.textAlign = "right";
                      context.fillText(totalDifSANTANI.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYsantani);
                    }
                  } // Recorre los ingresos de mes actual

                } catch (err) {
                  _iterator15.e(err);
                } finally {
                  _iterator15.f();
                }

                var _iterator16 = _createForOfIteratorHelper(losIngresosMesAct),
                    _step16;

                try {
                  for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
                    var _r3 = _step16.value;

                    if (_r3.TIPO == "PAGOS ELECTRONICOS") {
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.CUOTA_SOCIAL).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXcuota_, ejeYPagosElectronicos);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.TRATAMIENTO).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXtrata_, ejeYPagosElectronicos);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.COBRADOR).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXcobra_, ejeYPagosElectronicos);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.VENTA_NUEVA).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXventa_, ejeYPagosElectronicos);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.MONTO_TOTAL).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXmonto_, ejeYPagosElectronicos); // Diferencia ingresos pagos electronicos

                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifPagoElectronico);
                      context.textAlign = "right";
                      context.fillText(totalDifPagoElectronico.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYPagosElectronicos);
                    }

                    if (_r3.TIPO == "ASO. DEB.") {
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.CUOTA_SOCIAL).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXcuota_, ejeYAsoDebito);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.TRATAMIENTO).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXtrata_, ejeYAsoDebito);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.COBRADOR).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXcobra_, ejeYAsoDebito);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.VENTA_NUEVA).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXventa_, ejeYAsoDebito);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.MONTO_TOTAL).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXmonto_, ejeYAsoDebito); // Diferencia ingresos aso deb

                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifAsoDeb);
                      context.textAlign = "right";
                      context.fillText(totalDifAsoDeb.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYAsoDebito);
                    }

                    if (_r3.TIPO == "LICITACIONES") {
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.CUOTA_SOCIAL).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXcuota_, ejeYLicitacion);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.TRATAMIENTO).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXtrata_, ejeYLicitacion);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.COBRADOR).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXcobra_, ejeYLicitacion);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.VENTA_NUEVA).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXventa_, ejeYLicitacion);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.MONTO_TOTAL).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXmonto_, ejeYLicitacion); // Diferencia ingresos licitaciones

                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifLicitaciones);
                      context.textAlign = "right";
                      context.fillText(totalDifLicitaciones.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYLicitacion);
                    }

                    if (_r3.TIPO == "TRANSF. GIROS PALMA") {
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.CUOTA_SOCIAL).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXcuota_, ejeYTransGirosPalma);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.TRATAMIENTO).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXtrata_, ejeYTransGirosPalma);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.COBRADOR).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXcobra_, ejeYTransGirosPalma);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.VENTA_NUEVA).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXventa_, ejeYTransGirosPalma);
                      context.font = fuenteTexto;
                      context.fillStyle = "#34495E";
                      context.textAlign = "right";
                      context.fillText(parseFloat(_r3.MONTO_TOTAL).toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXmonto_, ejeYTransGirosPalma); // Diferencia ingresos trans giros palma

                      context.font = fuenteTexto;
                      context.fillStyle = colorSegunMonto(totalDifTransGirosPalma);
                      context.textAlign = "right";
                      context.fillText(totalDifTransGirosPalma.toLocaleString("es", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }), ejeXdiferencia_, ejeYTransGirosPalma);
                    }
                  } // Dibujar las fechas
                  // Mes Anterior

                } catch (err) {
                  _iterator16.e(err);
                } finally {
                  _iterator16.f();
                }

                context.font = "bold 13px Arial";
                context.fillStyle = "white";
                context.textAlign = "left";
                context.fillText(fechaConsultaMesAnt, ejeXFechaAnt, ejeYFechaAnt); // Mes actual

                context.font = "bold 13px Arial";
                context.fillStyle = "white";
                context.textAlign = "left";
                context.fillText(fechaConsultaMesAct, ejeXFechaAct, ejeYFechaAct); // Fila totales ZONA ASUNCION
                // SUM - Monto Total ZONA ASUNCION - MES ANTERIOR

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "left";
                context.fillText("ZONA ASUNCIÓN", ejeXsucu, ejeYtotalesAsu);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesAsuncionCS.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota, ejeYtotalesAsu);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesAsuncionTT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata, ejeYtotalesAsu);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesAsuncionCO.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra, ejeYtotalesAsu);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesAsuncionVN.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa, ejeYtotalesAsu); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesAsuncionMT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto, ejeYtotalesAsu); // SUM - Monto Total ZONA ASUNCION - MES ACTUAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesAsuncionCS_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota_, ejeYtotalesAsu);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesAsuncionTT_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata_, ejeYtotalesAsu);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesAsuncionCO_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra_, ejeYtotalesAsu);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesAsuncionVN_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa_, ejeYtotalesAsu); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesAsuncionMT_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto_, ejeYtotalesAsu);
                context.font = fuenteTextoBold;
                context.fillStyle = colorSegunMonto(difTotalesAsuncionMT);
                context.textAlign = "right";
                context.fillText(difTotalesAsuncionMT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXdiferencia_, ejeYtotalesAsu); // SUM - Monto Total ZONA GRAN ASUNCION - MES ANTERIOR

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "left";
                context.fillText("ZONA GRAN ASUNCIÓN", ejeXsucu, ejeYtotalesGranAsu);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesGAsuncionCS.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota, ejeYtotalesGranAsu);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesGAsuncionTT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata, ejeYtotalesGranAsu);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesGAsuncionCO.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra, ejeYtotalesGranAsu);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesGAsuncionVN.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa, ejeYtotalesGranAsu); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesGAsuncionMT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto, ejeYtotalesGranAsu); // SUM - Monto Total ZONA GRAN ASUNCION - MES ACTUAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesGAsuncionCS_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota_, ejeYtotalesGranAsu);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesGAsuncionTT_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata_, ejeYtotalesGranAsu);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesGAsuncionCO_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra_, ejeYtotalesGranAsu);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesGAsuncionVN_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa_, ejeYtotalesGranAsu); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesGAsuncionMT_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto_, ejeYtotalesGranAsu);
                context.font = fuenteTextoBold;
                context.fillStyle = colorSegunMonto(difTotalesGAsuncionMT);
                context.textAlign = "right";
                context.fillText(difTotalesGAsuncionMT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXdiferencia_, ejeYtotalesGranAsu); // SUM - Monto Total ZONA RUTA 2 - MES ANTERIOR

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "left";
                context.fillText("ZONA RUTA 2", ejeXsucu, ejeYtotalesRuta2);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesR2CS.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota, ejeYtotalesRuta2);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesR2TT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata, ejeYtotalesRuta2);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesR2CO.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra, ejeYtotalesRuta2);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesR2VN.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa, ejeYtotalesRuta2); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesR2MT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto, ejeYtotalesRuta2); // SUM - Monto Total ZONA RUTA 2 - MES ACTUAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesR2CS_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota_, ejeYtotalesRuta2);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesR2TT_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata_, ejeYtotalesRuta2);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesR2CO_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra_, ejeYtotalesRuta2);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesR2VN_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa_, ejeYtotalesRuta2); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesR2MT_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto_, ejeYtotalesRuta2);
                context.font = fuenteTextoBold;
                context.fillStyle = colorSegunMonto(difTotalesR2MT);
                context.textAlign = "right";
                context.fillText(difTotalesR2MT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXdiferencia_, ejeYtotalesRuta2); // SUM - Monto Total ZONA ITAPUA - MES ANTERIOR

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "left";
                context.fillText("ZONA ITAPUA", ejeXsucu, ejeYtotalesItapua);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesItaCS.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota, ejeYtotalesItapua);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesItaTT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata, ejeYtotalesItapua);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesItaCO.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra, ejeYtotalesItapua);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesItaVN.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa, ejeYtotalesItapua); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesItaMT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto, ejeYtotalesItapua); // SUM - Monto Total ZONA ITAPUA - MES ACTUAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesItaCS_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota_, ejeYtotalesItapua);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesItaTT_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata_, ejeYtotalesItapua);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesItaCO_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra_, ejeYtotalesItapua);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesItaVN_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa_, ejeYtotalesItapua); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesItaMT_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto_, ejeYtotalesItapua);
                context.font = fuenteTextoBold;
                context.fillStyle = colorSegunMonto(difTotalesItaMT);
                context.textAlign = "right";
                context.fillText(difTotalesItaMT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXdiferencia_, ejeYtotalesItapua); // SUM - Monto Total ZONA ALTO PARANA - MES ANTERIOR

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "left";
                context.fillText("ZONA ALTO PARANA", ejeXsucu, ejeYtotalesAltoP);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesApCS.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota, ejeYtotalesAltoP);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesApTT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata, ejeYtotalesAltoP);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesApCO.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra, ejeYtotalesAltoP);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesApVN.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa, ejeYtotalesAltoP); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesApMT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto, ejeYtotalesAltoP); // SUM - Monto Total ZONA ALTO PARANA - MES ACTUAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesApCS_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota_, ejeYtotalesAltoP);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesApTT_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata_, ejeYtotalesAltoP);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesApCO_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra_, ejeYtotalesAltoP);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesApVN_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa_, ejeYtotalesAltoP); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesApMT_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto_, ejeYtotalesAltoP);
                context.font = fuenteTextoBold;
                context.fillStyle = colorSegunMonto(difTotalesApMT);
                context.textAlign = "right";
                context.fillText(difTotalesApMT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXdiferencia_, ejeYtotalesAltoP); // SUM - Monto Total ZONA SAN PEDRO - MES ANTERIOR

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "left";
                context.fillText("ZONA SAN PEDRO", ejeXsucu, ejeYtotalesSanPe);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesSpCS.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota, ejeYtotalesSanPe);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesSpTT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata, ejeYtotalesSanPe);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesSpCO.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra, ejeYtotalesSanPe);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesSpVN.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa, ejeYtotalesSanPe); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesSpMT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto, ejeYtotalesSanPe); // SUM - Monto Total ZONA SAN PEDRO - MES ACTUAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesSpCS_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota_, ejeYtotalesSanPe);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesSpTT_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata_, ejeYtotalesSanPe);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesSpCO_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra_, ejeYtotalesSanPe);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesSpVN_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa_, ejeYtotalesSanPe); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(sumTotalesSpMT_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto_, ejeYtotalesSanPe);
                context.font = fuenteTextoBold;
                context.fillStyle = colorSegunMonto(difTotalesSpMT);
                context.textAlign = "right";
                context.fillText(difTotalesSpMT.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXdiferencia_, ejeYtotalesSanPe);
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
                context.fillText(totalGenCuotaSocial.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota, ejeYTotalGeneral);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenTratamiento.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata, ejeYTotalGeneral);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenCobrador.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra, ejeYTotalGeneral);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenVentaNueva.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa, ejeYTotalGeneral); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenMontoTotal.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto, ejeYTotalGeneral);
                /**
                 *  TOTAL SUCURSAL - MES ACTUAL
                 */

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenCuotaSocial_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota_, ejeYTotalGeneral);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenTratamiento_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata_, ejeYTotalGeneral);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenCobrador_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra_, ejeYTotalGeneral);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenVentaNueva_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa_, ejeYTotalGeneral); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenMontoTotal_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto_, ejeYTotalGeneral); // DIFERENCIA TOTAL SUCURSAL

                context.font = fuenteTextoBold;
                context.fillStyle = colorSegunMonto(totalGenMontoTotal_ - totalGenMontoTotal);
                context.textAlign = "right";
                context.fillText((totalGenMontoTotal_ - totalGenMontoTotal).toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXdiferencia_, ejeYTotalGeneral);
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
                context.fillText(totalGenINCuotaSocial.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota, ejeYTotalADM);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenINTratamiento.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata, ejeYTotalADM);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenINCobrador.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra, ejeYTotalADM);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenINVentaNueva.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa, ejeYTotalADM); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenINMontoTotal.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto, ejeYTotalADM);
                /**
                 *   TOTAL ADM - INGRESOS MES ACTUAL
                 */

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenINCuotaSocial_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota_, ejeYTotalADM);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenINTratamiento_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata_, ejeYTotalADM);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenINCobrador_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra_, ejeYTotalADM);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenINVentaNueva_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa_, ejeYTotalADM); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText(totalGenINMontoTotal_.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto_, ejeYTotalADM); // Diferencia monto total adm

                context.font = fuenteTextoBold;
                context.fillStyle = colorSegunMonto(totalDifTotalADM);
                context.textAlign = "right";
                context.fillText(totalDifTotalADM.toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXdiferencia_, ejeYTotalADM);
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
                context.fillText((totalGenCuotaSocial + totalGenINCuotaSocial).toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota, ejeYtotalGeneralDoc);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText((totalGenTratamiento + totalGenINTratamiento).toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata, ejeYtotalGeneralDoc);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText((totalGenCobrador + totalGenINCobrador).toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra, ejeYtotalGeneralDoc);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText((totalGenVentaNueva + totalGenINVentaNueva).toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa, ejeYtotalGeneralDoc); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText((totalGenMontoTotal + totalGenINMontoTotal).toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto, ejeYtotalGeneralDoc); // TOTAL GENERAL - TOTAL DOC mes actual

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText((totalGenCuotaSocial_ + totalGenINCuotaSocial_).toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcuota_, ejeYtotalGeneralDoc);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText((totalGenTratamiento_ + totalGenINTratamiento_).toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXtrata_, ejeYtotalGeneralDoc);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText((totalGenCobrador_ + totalGenINCobrador_).toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXcobra_, ejeYtotalGeneralDoc);
                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText((totalGenVentaNueva_ + totalGenINVentaNueva_).toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXventa_, ejeYtotalGeneralDoc); // MONTO TOTAL

                context.font = fuenteTextoBold;
                context.fillStyle = "#34495E";
                context.textAlign = "right";
                context.fillText((totalGenMontoTotal_ + totalGenINMontoTotal_).toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXmonto_, ejeYtotalGeneralDoc); // Diferencia monto TOTAL GENERAL DOC

                context.font = fuenteTextoBold;
                context.fillStyle = colorSegunMonto(totalGenMontoTotal_ - totalGenMontoTotal + totalDifTotalADM);
                context.textAlign = "right";
                context.fillText((totalGenMontoTotal_ - totalGenMontoTotal + totalDifTotalADM).toLocaleString("es", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }), ejeXdiferencia_, ejeYtotalGeneralDoc); // Escribe la imagen a archivo

                var buffer = canvas.toBuffer("image/png");
                fs.writeFileSync("./Reporte 2 - Acumulado " + fechaConsultaMesAct + ".png", buffer); // Convierte el canvas en una imagen base64

                var base64Image = canvas.toDataURL();
                fileBase64Media = base64Image.split(",")[1];
              }).then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
                var _iterator17, _step17, n;

                return _regeneratorRuntime().wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        // Recorre el array de los numeros
                        _iterator17 = _createForOfIteratorHelper(numerosDestinatarios);
                        _context.prev = 1;

                        _iterator17.s();

                      case 3:
                        if ((_step17 = _iterator17.n()).done) {
                          _context.next = 12;
                          break;
                        }

                        n = _step17.value;
                        console.log(n);
                        mensajeBody = {
                          message: "Buenas noches, se envia el reporte de acumulados mes anterior y mes actual.",
                          phone: n.NUMERO,
                          mimeType: fileMimeTypeMedia,
                          data: fileBase64Media,
                          fileName: "",
                          fileSize: ""
                        }; // Envia el mensaje por la API free WWA

                        axios.post(wwaUrl, mensajeBody).then(function (response) {
                          var data = response.data;

                          if (data.responseExSave.id) {
                            console.log("Enviado - OK"); // Se actualiza el estado a 1

                            var body = {
                              estado_envio: 1
                            }; // Tickets.update(body, {
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
                            console.log("No Enviado - unknow"); // Se actualiza el estado a 3

                            var _body = {
                              estado_envio: 3
                            }; // Tickets.update(body, {
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
                            var errMsg = data.responseExSave.error.slice(0, 17);

                            if (errMsg === "Escanee el código") {
                              //updateEstatusERROR(turnoId, 104);
                              console.log("Error 104: ", data.responseExSave.error);
                            } // Sesion cerrada o desvinculada. Puede que se envie al abrir la sesion o al vincular


                            if (errMsg === "Protocol error (R") {
                              //updateEstatusERROR(turnoId, 105);
                              console.log("Error 105: ", data.responseExSave.error);
                            } // El numero esta mal escrito o supera los 12 caracteres


                            if (errMsg === "Evaluation failed") {
                              //updateEstatusERROR(turnoId, 106);
                              console.log("Error 106: ", data.responseExSave.error);
                            }
                          }
                        })["catch"](function (error) {
                          console.error("Ocurrió un error:", error.code);
                        });
                        _context.next = 10;
                        return retraso();

                      case 10:
                        _context.next = 3;
                        break;

                      case 12:
                        _context.next = 17;
                        break;

                      case 14:
                        _context.prev = 14;
                        _context.t0 = _context["catch"](1);

                        _iterator17.e(_context.t0);

                      case 17:
                        _context.prev = 17;

                        _iterator17.f();

                        return _context.finish(17);

                      case 20:
                        console.log("Fin del envío del reporte de acumulados mes anterior y actual");

                      case 21:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[1, 14, 17, 20]]);
              }))).then(function () {
                //console.log("Se resetean los montos");
                setTimeout(function () {
                  console.log("Se resetearon los montos");
                  resetMontos();
                }, 30000);
              });

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _enviarMensaje.apply(this, arguments);
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
    sumTotalesAsuncionMT_ = 0; // Sub Totales Zona Gran Asuncion

    sumTotalesGAsuncionCS = 0;
    sumTotalesGAsuncionTT = 0;
    sumTotalesGAsuncionCO = 0;
    sumTotalesGAsuncionVN = 0;
    sumTotalesGAsuncionMT = 0;
    sumTotalesGAsuncionCS_ = 0;
    sumTotalesGAsuncionTT_ = 0;
    sumTotalesGAsuncionCO_ = 0;
    sumTotalesGAsuncionVN_ = 0;
    sumTotalesGAsuncionMT_ = 0; // Sub Totales Zona Ruta 2

    sumTotalesR2CS = 0;
    sumTotalesR2TT = 0;
    sumTotalesR2CO = 0;
    sumTotalesR2VN = 0;
    sumTotalesR2MT = 0;
    sumTotalesR2CS_ = 0;
    sumTotalesR2TT_ = 0;
    sumTotalesR2CO_ = 0;
    sumTotalesR2VN_ = 0;
    sumTotalesR2MT_ = 0; // Sub Totales Zona Itapua

    sumTotalesItaCS = 0;
    sumTotalesItaTT = 0;
    sumTotalesItaCO = 0;
    sumTotalesItaVN = 0;
    sumTotalesItaMT = 0;
    sumTotalesItaCS_ = 0;
    sumTotalesItaTT_ = 0;
    sumTotalesItaCO_ = 0;
    sumTotalesItaVN_ = 0;
    sumTotalesItaMT_ = 0; // Sub Totales Zona Alto Parana

    sumTotalesApCS = 0;
    sumTotalesApTT = 0;
    sumTotalesApCO = 0;
    sumTotalesApVN = 0;
    sumTotalesApMT = 0;
    sumTotalesApCS_ = 0;
    sumTotalesApTT_ = 0;
    sumTotalesApCO_ = 0;
    sumTotalesApVN_ = 0;
    sumTotalesApMT_ = 0; // Sub Totales Zona San Pedro

    sumTotalesSpCS = 0;
    sumTotalesSpTT = 0;
    sumTotalesSpCO = 0;
    sumTotalesSpVN = 0;
    sumTotalesSpMT = 0;
    sumTotalesSpCS_ = 0;
    sumTotalesSpTT_ = 0;
    sumTotalesSpCO_ = 0;
    sumTotalesSpVN_ = 0;
    sumTotalesSpMT_ = 0; // Totales Generales

    totalGenCuotaSocial = 0;
    totalGenTratamiento = 0;
    totalGenCobrador = 0;
    totalGenVentaNueva = 0;
    totalGenMontoTotal = 0;
    totalGenCuotaSocial_ = 0;
    totalGenTratamiento_ = 0;
    totalGenCobrador_ = 0;
    totalGenVentaNueva_ = 0;
    totalGenMontoTotal_ = 0; // Totales ADM

    totalGenINCuotaSocial = 0;
    totalGenINTratamiento = 0;
    totalGenINCobrador = 0;
    totalGenINVentaNueva = 0;
    totalGenINMontoTotal = 0;
    totalGenINCuotaSocial_ = 0;
    totalGenINTratamiento_ = 0;
    totalGenINCobrador_ = 0;
    totalGenINVentaNueva_ = 0;
    totalGenINMontoTotal_ = 0;
  }
};