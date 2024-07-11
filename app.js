require('dotenv').config();
const express = require("express");
const app = express()
// const multer = require('multer');
const mongoose = require('mongoose')
const path = require('path')
const {userRouter} = require('./controllers/usuarios');
const productRouter = require('./controllers/productos');
const pagoRouter = require('./controllers/pagos');


async function conectarDB() {
  try {
    await mongoose.connect(process.env.token)

    console.log('se ha conectado a la bd')
  } catch (error) {
    console.log(error);
  }
}

conectarDB()


//rutas de frontend 

app.use('/', express.static(path.resolve('views', 'home')))
app.use('/Login', express.static(path.resolve('views', 'usuarioLogin')))
app.use('/Register', express.static(path.resolve('views', 'usuarioRegister')))
app.use('/css', express.static(path.resolve('views', 'css')))
app.use('/img', express.static(path.resolve('views', 'img')))
app.use('/pagoIMG', express.static(path.resolve('views', 'pagoIMG')))
app.use('/maquillaje', express.static(path.resolve('views', 'maquillaje')))
app.use('/assets', express.static(path.resolve('views', 'assets')))
app.use('/nosotros', express.static(path.resolve('views', 'nosotros')))
app.use('/MasVendidos', express.static(path.resolve('views', 'masVendidos')))
app.use('/skincare', express.static(path.resolve('views', 'skincare')))
app.use('/belleza', express.static(path.resolve('views', 'belleza')))
app.use('/controllers',express.static(path.resolve('controllers')))
app.use("/components", express.static(path.resolve("views", "components")));
app.use('/ver', express.static(path.resolve('views', 'ver')))
app.use('/pago', express.static(path.resolve('views', 'pago')))
app.use('/dashboard', express.static(path.resolve('views', 'dashboard')))
app.use('/carrito', express.static(path.resolve('views', 'carrito')))
app.use('/crear', express.static(path.resolve('views', 'crear')))
app.use('/editar', express.static(path.resolve('views', 'editar')))
app.use('/eliminar', express.static(path.resolve('views', 'eliminar')))
app.use('/comprobantes', express.static(path.resolve('views', 'comprobantes')))
app.use('/eliminarMaquillaje', express.static(path.resolve('views', 'eliminarM')))
app.use('/eliminarSkincare', express.static(path.resolve('views', 'eliminarS')))
app.use('/eliminarBelleza', express.static(path.resolve('views', 'eliminarB')))
app.use('/RegisterAdmin', express.static(path.resolve('views', 'RegisterAdmin')))
app.use('/editarMaquillaje', express.static(path.resolve('views', 'EDITARM')))
app.use('/editarSkincare', express.static(path.resolve('views', 'EDITARS')))
app.use('/editarBelleza', express.static(path.resolve('views', 'EDITARB')))
app.use('/editarForm', express.static(path.resolve('views', 'EDITARFORM')))
app.use('/userPanel', express.static(path.resolve('views', 'USERPANEL')))
app.use('/HISTORIAL', express.static(path.resolve('views', 'HISTORIAL')))
app.use('/PC', express.static(path.resolve('views', 'COMPRO')))
app.use('/CONFIGURACION', express.static(path.resolve('views', 'CONFIGURACION')))

app.use(express.json());

  // app.use("/controllers", ("controllers", "usuarios")));
  // app.use("/controllers", express.static(path.resolve("controllers", "productos")));

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/pagos', pagoRouter);








module.exports = app
