const userRouter = require("express").Router();
const user = require("../models/usuario");
const axios = require("axios");
const jwt = require("jsonwebtoken");

userRouter.get("/consultar-user", async (req, res) => {
  const { email, password } = req.query;

  try {
    const consulta = await user.findOne({ email: email });
    console.log("entrando en la consulta")
    if (consulta.password === password) {
      console.log("contraseñas coinciden")

      const userData = { email: email, id: consulta.id, rol: consulta.rol };
      const token = jwt.sign(userData, process.env.SECRET_KEY, { expiresIn: "40m" });

// Usar un operador ternario para obtener la ruta
let roles ={ 1: `/?rol=user${"&"}id=${consulta.id}` ,
2: `/dashboard?rol=admin${"&"}id=${consulta.id}`
}

      res.status(200).json({
        token: token,
        path: roles[consulta.rol],
      });

    } else {
      console.log("contraseñas distintas")
      res.status(400).json({ message: "Contraseña incorrecta" });
    }
  } catch (error) {
    console.log("no se puede obtener el usuario")
    res.status(404).json({ message: "Usuario no encontrado" });
  }
});

userRouter.post('/verify-token', async (req, res) => {
  const { token } = req.body;

  try {
    console.log("buscando token")
    const userData = jwt.verify(token, process.env.SECRET_KEY);
    console.log("encontrado")
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(401).json({ message: "Token inválido" });
  }
});

// Cierre de sesión
userRouter.post('/logout', async (req, res) => {
  const { token } = req.body;
  try {
    // Invalidar el token en la base de datos o en la sesión del servidor
    // Por ejemplo, puedes eliminar el token de la sesión del usuario
    await user.findByIdAndUpdate(req.body.userId, { $unset: { token: '' } });
    res.status(200).json({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).json({ message: "Error al cerrar sesión" });
  }
});

userRouter.post("/", async (req, res) => {
  console.log("registrando")
  const { nombre, email, password, telefono, rol } = req.body;
  const usuario = new user();

  const listado = [nombre, email, password, telefono].some((i) => i === "");
  console.log("validando")

  if (listado) {
    return res
      .status(400)
      .json({ message: "No puede dejar los campos vacios" });
  }

  usuario.usuario = nombre;
  usuario.email = email;
  usuario.password = password;
  usuario.telefono = telefono;
  usuario.rol = rol


  try {
    await usuario.save();
    console.log("post")

    const usuarios = await user.find()
    res.status(200).json({
      message: "Se ha creado el usuario con exito",
    });


  } catch (error) {
    
    res.status(500). json({
      message: "Error al crear el usuario",
    })
  }

  console.log(req.body)
});

userRouter.put("/userEDITAR", async (req, res) => {
  console.log("editando")
  const { nombre, email, password, telefono,  oldE} = req.body;

  const listado = [nombre, email, password, telefono].some((i) => i === "");
  console.log("validando")

  if (listado) {
    return res
      .status(400)
      .json({ message: "No puede dejar los campos vacios" });
  }
try{

const usuario = await user.findOne({ email:  oldE});
console.log("Cambiando")
if(usuario){
    usuario.usuario = nombre;
  usuario.email = email;
  usuario.password = password;
  usuario.telefono = telefono;

await usuario.save();
console.log("EDITADO")
res.status(200).json({ message: "Usuario editado con éxito" });
}

else {
res.status(404).json({ message: "Usuario no encontrado" });
}


  } catch (error) {
    
    res.status(500). json({
      message: "Error al crear el usuario",
    })
  }

  console.log(req.body)
});



userRouter.get("/consultar", async (req, res) => {
  console.log("consulta correo")

  const {email} = req.query;
  console.log(email)
try{
  const consulta = await user.findOne({ email: email});
console.log("entrando en la consulta")
if (consulta) {
  console.log("usuario encontrado")
  res.status(200).json(consulta);
  console.log(consulta.rol)
}else {
  console.log("Correo libre");
  console.log("Response data:", { message: "Correo libre" }); 
  res.status(204).json({ message: "Correo libre" });
}
}catch(error){
  console.log("no se puede obtener el usuario")
  res.status(404).json({ message: "Usuario no encontrado" });

}})

userRouter.post("/carrito", async (req, res)=>{
  const  userC = req.body.userC;
  const  newGuardado= req.body.newGuardado;
  try{
    const consulta = await user.findOne({ email: userC});
  console.log("entrando en la consulta")
  if (!consulta) {
    console.log("usuario no encontrado")
   return console.log("no encontrado")
  }
  consulta.guardados = [...(consulta.guardados || []), newGuardado];

  await consulta.save();
  console.log("guardando producto")
  res.status(200).json({ message: "Se ha agregado al carrito" });
  console.log("se ha agregado al carrito")
}
catch(error){
  console.log(error)
}






})

userRouter.delete("/eliminarCarrito", async (req, res) => {
  console.log("ENTRANDO A LA CONSULTA PARA ELIMINAR DEL CARRITO")
  const { userEmail, productoId } = req.query;

  try {
    const consulta = await user.findOne({ email: userEmail });
    if (!consulta) {
      console.log("usuario no encontrado");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("usuario encontrado")

    const guardadoToRemove = consulta.guardados.find((guardado) => guardado === productoId);
    if (!guardadoToRemove) {
      console.log("Producto no encontrado en el carrito");
      return res.status(404).json({ message: "Product not found in cart" });
    }

    await user.findOneAndUpdate({ email: userEmail }, { $pull: { guardados: productoId } });
    console.log("PRODUCTO ELIMINADO DEL CARRITO")
    res.status(200).json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar producto del carrito" });
  }
});



userRouter.post("/historial", async (req, res)=>{
  const  correo = req.body.correo;
  const pedido= req.body.pedido;
  try{
    const consulta = await user.findOne({ email: correo});
  console.log("entrando en la consulta")
  if (!consulta) {
    console.log("usuario no encontrado")
   return console.log("no encontrado")
  }
  consulta.compras = [...(consulta.compras || []), pedido];

  await consulta.save();
  console.log("guardando producto")
  res.status(200).json({ message: "Se ha agregado al historial" });
  console.log("se ha agregado al historial")
}
catch(error){
  console.log(error)
}
})


userRouter.post("/guardar", async (req, res)=>{
  const  correo = req.body.correo;
  const referencia= req.body.referencia;
  try{
    const consulta = await user.findOne({ email: correo});
  console.log("entrando en la consulta")
  if (!consulta) {
    console.log("usuario no encontrado")
   return console.log("no encontrado")
  }
  consulta.pagos = [...(consulta.pagos  || []), referencia];

  await consulta.save();
  console.log("guardando producto")
  res.status(200).json({ message: "Se ha agregado al historial" });
  console.log("se ha agregado al historial")
}
catch(error){
  console.log(error)
}
})

module.exports = {userRouter, jwt};
