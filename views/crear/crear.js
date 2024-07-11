const logoutBtn = document.querySelector("#logOut");
 

logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token") 
  try {
    await axios.post('/api/users/logout', { token});
    localStorage.removeItem("token");
    window.location.href = "/";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  
  console.log("entrando en la verificación de token")
  if (token) {
    try {
      const userData = await consultarToken(token)
      const userEmail = userData.email;
      try {
        const user = await consultarUser(userEmail);
        if(user.data.rol === 1){
          window.location.href = "/";
        }

      } catch (error) {
        console.error("Error al consultar el usuario:", error);
        // Maneja el error de forma adecuada
      }
      
      
    } catch (error) {
      console.error("Error al verificar el token:", error);
      // Maneja el error de forma adecuada
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    
  } else {
    console.log("El token no existe")
    window.location.href = "/login";
  }
});


async function consultarToken(token) {
  try {
    const response = await axios.post('/api/users/verify-token', { token });
    return response.data;
  } catch (error) {
    console.error("Error al verificar el token:", error);
   
  }
}
// }


async function consultarUser(userEmail) {
  try {
    const user = await axios.get("/api/users/consultar", {
      params: {
        email: userEmail,
      },
    });console.log("encontrado")
    return user;
  } catch (error) {
    console.error("Error al consultar el usuario:", error);
    // Maneja el error de forma adecuada
  }
}

const formulario = document.querySelector("#formulario");
const inputNombre = document.querySelector("#nombre");
const inputPrecio = document.querySelector("#precio");
const inputTitulo = document.querySelector("#titulo");
const inputMarca = document.querySelector("#marca");
const inputDescripcion = document.querySelector("#descripcion");
const inputID = document.querySelector("#id");
const inputCategoria = document.querySelector("#categoria");
const notificacion = document.querySelector(".notification")
const inputfoto = document.querySelector("#foto");

function notification(message) {
  notificacion.classList.add("show-notification");
  notificacion.textContent = message;
  setTimeout(() => {
    notificacion.classList.remove("show-notification");
  }, 3000);
}

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const codigo =  inputID.value
  
    if (!inputfoto.value) {
      return notification("Tiene que cargar un archivo antes de enviar");
    }
 
  // const newProducto = {
  //   codigo: inputID.value,
  //   type: inputCategoria.value,
  //   name: inputNombre.value,
  //   price: inputPrecio.value,
  //   title: inputTitulo.value,
  //   marca: inputMarca.value,
  //   description: inputDescripcion.value,
  //   image: inputfoto.files[0].name,
  //   venta: 0

  // };
  
  // console.log(newProducto)
  const data = new FormData(formulario);
console.log(data)
  try {
    const Verificar = await consultarProducto(codigo)
    console.log(codigo)
    if(Verificar){
      return notification("Este codigo ya esta en uso en otro producto, ingrese otro")
    }
    
   const post1 =  await guardarProducto(data);
     console.log(data)

   console.log(false, post1.data.message)
   notification( post1.data.message);
   formulario.reset(); 

  } catch (error) {
 return notification("Error al crear producto");  }

});


async function guardarProducto (data) {
  const post = axios.post("/api/products/", data)
  return post;
};


async function consultarProducto(codigo){
  const producto = axios.get("/api/products/buscarProducto", {
    params: {
      codigo: codigo,
    },
  });
  return producto;
}