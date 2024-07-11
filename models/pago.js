const mongoose = require("mongoose");
const pagoRouter = require("../controllers/pagos");
// verifcar router

const pago = new mongoose.Schema({
  nombre: String,
  correo: String,
  whatsapp: String,
  referencia: String,
  monto: String,
comprobante: String, 
fecha: String,
aprobado: Boolean, 
pedido: String
  }

);

// en el esquema

pago.set("toJSON", {
  transform: (document, returnObj) => {
    returnObj.id = returnObj._id.toString();
    delete returnObj._id;
  },
});

//registrar el modelo

const pagos = mongoose.model("Pagos", pago);

//exportar

module.exports = pagos;
