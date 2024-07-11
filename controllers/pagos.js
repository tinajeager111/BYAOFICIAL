const Prouter = require("express").Router();
const multer = require('multer');
const axios = require("axios");
const pago = require('../models/pago');

const storage = multer.diskStorage({
  destination: function (req, file, cb){
     cb(null, 'views/' + 'pagoIMG'); 
   },
   filename: function (req, file, cb) {
     cb(null, `${Date.now()}-${file.originalname}`);  
   },
 });

 const upload = multer({storage});

// Use upload.single('PAGO') as middleware 
Prouter.post('/', upload.single('PAGO'), async (req, res) => {
  console.log('holaaaaaa')
  if (req.file === undefined) {
    console.log("imagen undefined")
    return res.status(400).json({
      message: "Tiene que cargar un archivo antes de enviar",
    });
  }
  console.log (req.body)
  const { path } = req.file;
  console.log(path)
  const { REFERENCIA, NOMBRE, MONTO, CORREO, TELEFONO, PEDIDO} = req.body;
  const newPago = new pago()
const now = new Date()
  console.log("entrando al post")

  // Crea un nuevo objeto Producto con los datos del formulario y la ruta de la imagen
  console.log("guardando datos")

  newPago.nombre= NOMBRE;
  newPago.correo= CORREO;
  newPago.whatsapp= TELEFONO;
  newPago.referencia = REFERENCIA;
  newPago.monto = MONTO;
  newPago.pedido = PEDIDO;
  newPago.comprobante =  '/pagoIMG/' + req.file.filename;
  newPago.fecha = now.toLocaleDateString()
  newPago.aprobado = false;

  try{
    // Guarda el objeto Producto en la base de datos
     newPago.save();
     console.log("guardando")
    res.status(201).json({ message: "Pago enviado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error mandar pago' });
  }
});


Prouter.get('/listado', async (req, res)=>{
    try {
      const listado = await pago.find()
      console.log(listado)
      res.status(200).json(listado)
  
    } catch (error) {
      console.log(error) 
      res.status(400).json({
        mensaje: 'Error al consultar los productos'
      })   
    }
   })
  
   
   Prouter.get("/REF", async (req, res) => {
    console.log("REQ:", req.query); // Verificar que se está recibiendo el parámetro referencia
    const { referencia } = req.query;
    try {
      const consulta = await pago.findOne({ referencia: referencia });
      if (consulta) {
        console.log("Pago encontrado")
        res.status(200).json(consulta);
      } else {
        res.status(400).json({
          message: "Producto no encontrado",
        });
      }
    } catch (error) {
      console.error("Error al consultar la referencia:", error);
      res.status(400).json({
        message: "Error al consultar la referencia",
      });
    }
  });
  
Prouter.post("/aprobar", async (req, res) => {
  console.log("entrando a la consulta")
  const REF = req.body.referencia;

  try {
   const consulta = await pago.findOne({ referencia: REF });
   consulta.aprobado=  true
   await consulta.save()
    console.log("Pago verificado correctamente" );
    res.status(200).json({ message: "Pago verificado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al verificar pago" });
  }
});

Prouter.delete("/delete", async (req, res) => {
  console.log("entrando a la consulta")
  const {referencia} = req.query;
console.log(referencia)
  try {
    const pagoToDelete = await pago.findOneAndDelete({ referencia: referencia });
    if (!pagoToDelete) {
      res.status(404).json({ message: "Pago no encontrado" });
      return;
    }

  } catch (error) {
    console.log("Error al eliminar pago:", error);
    res.status(500).json({ message: "Error al eliminar pago" });
  }
});
module.exports = Prouter;