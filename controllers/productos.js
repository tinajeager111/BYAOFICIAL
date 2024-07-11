
const routerP = require("express").Router();
 const multer = require('multer');
 const axios = require("axios");
const Producto = require('../models/producto');
const storage = multer.diskStorage({
  destination: function (req, file, cb){
     cb(null, 'views/' + 'img'); 
   },
   filename: function (req, file, cb) {
    console.log(file)
     cb(null, `${Date.now()}-${file.originalname}`);  
   },
 });

 const upload = multer({storage})

routerP.post('/', upload.single('PRODUCTO'), async (req, res) => {
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
  const { CODIGO, NOMBRE, PRECIO, TITULO, MARCA, DESCRIPCION, CATEGORIA} = req.body;
  const newProducto = new Producto()
 
 console.log("entrando al post")

    // Crea un nuevo objeto Producto con los datos del formulario y la ruta de la imagen
   console.log("guardando datos")

    newProducto.codigo= CODIGO;
    newProducto.type = CATEGORIA;
    newProducto.name = NOMBRE;
    newProducto.price = PRECIO;
    newProducto.title = TITULO;
    newProducto.marca = MARCA;
    newProducto.description = DESCRIPCION;
    newProducto.image = '/img/' + req.file.filename;
    newProducto.venta =0

    try{
    // Guarda el objeto Producto en la base de datos
     newProducto.save();
     console.log("guardando")
    res.status(201).json({ message: "Producto creado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
});

//  async function consulta(){
//   const listado = await Producto.find()
//   console.log(listado)
// }

 routerP.get('/listado', async (req, res)=>{
  try {
    const listado = await Producto.find()
    console.log(listado)
    res.status(200).json(listado)

  } catch (error) {
    console.log(error) 
    res.status(400).json({
      mensaje: 'Error al consultar los productos'
    })   
  }
 })

 
routerP.get("/buscarProducto", async (req, res) => {
  const { codigo } = req.query;
  try{
  const consulta = await Producto.findOne({ codigo: codigo});
  if (consulta) {
    console.log("Producto encontrado")
    res.status(200).json(consulta);
  }}catch{ 
    res.status(400).json({
      message: "Producto no encontrado",
    });
    console.log("no se puede obtener el producto")
  }
});

 routerP.delete("/eliminar", async (req, res) => {
  const {codigo} = req.query;
  try {
    const eliminar = await Producto.findOneAndDelete({ codigo: codigo });
    res.status(200).json({
      message: "El producto se ha eliminado con éxito",
    });
    console.log("se ha eliminado el producto")

  } catch (error) {
    console.log("no se ha eliminado")
    res.status(400).json({
      message: "Hubo un error al eliminar el producto",
    });
  }
});


routerP.post("/Contador", async (req, res) =>{
  const { codigo } = req.body;
  console.log(req.body)


  try {
    const consulta = await Producto.findOne({ codigo: codigo });

    if (consulta) {
      consulta.venta = consulta.venta + 1; // incrementa el valor de venta en 1
      await consulta.save(); // guarda los cambios en la base de datos
      console.log("Producto encontrado y actualizado");
      res.status(200).json(consulta);
    } else {
      res.status(400).json({
        message: "Producto no encontrado",
      });
      console.log("no se puede obtener el producto");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar el producto",
    }); 
  }
});

routerP.put('/editar', upload.single('PRODUCTO'), async (req, res) => {
  const { CODIGO, NOMBRE, PRECIO, TITULO, MARCA, DESCRIPCION, CATEGORIA } = req.body;
console.log(req.body)
  try {
    const producto = await Producto.findOne({ codigo: CODIGO });
    if (producto) {
      producto.name = NOMBRE;
      producto.price = PRECIO;
      producto.title = TITULO;
      producto.marca = MARCA;
      producto.description = DESCRIPCION;
      producto.type = CATEGORIA;
      if (req.file) {
        producto.image = `/img/${req.file.filename}`;
      }
      await producto.save();
      res.status(200).json({ message: "Producto editado con éxito" });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al editar producto" });
  }
});


module.exports = routerP;