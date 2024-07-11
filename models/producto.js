const mongoose = require("mongoose");

// verificar router

const producto = new mongoose.Schema({
    
  codigo: String,
      type: String,
      name: String,
      price: Number,
      title: String,
      marca: String,
      description: String,
    image: String,
    venta: Number
  }
  

);

//respuesta del usuario en el esquema

producto.set("toJSON", {
  transform: (document, returnObj) => {
    returnObj.id = returnObj._id.toString();
    delete returnObj._id;
  },
});

//registrar el modelo

const product = mongoose.model("Productos", producto);

//exportar

module.exports = product;
