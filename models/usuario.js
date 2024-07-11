const mongoose = require("mongoose");
const Producto = require('../models/producto');

const user = new mongoose.Schema({
  usuario: String,
  password: String,
  telefono: String,
  email: String,
  rol: Number,
  verificar: {
    type: Boolean,
    default: false,
  },
  guardados: [{ type: String }],
  compras: [{ type: String }],
  pagos: [{ type: String }]

});
  

//respuesta del usuario en el esquema

user.set("toJSON", {
  transform: (document, returnObj) => {
    returnObj.id = returnObj._id.toString();
    delete returnObj._id;
  },
});

//registrar el modelo

const usuario = mongoose.model("User", user);

//exportar

module.exports = usuario;
