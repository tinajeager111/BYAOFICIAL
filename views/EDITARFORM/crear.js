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
const listado = document.querySelector("#lista-productos")




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
  
  const URL = new URLSearchParams(window.location.search);

 const producto = URL.get('producto');

 const P = await consultarProducto(producto) 

 mostrarProducto(P)

});


async function consultarToken(token) {
  try {
    const response = await axios.post('/api/users/verify-token', { token });
    return response.data;
  } catch (error) {
    console.error("Error al verificar el token:", error);
   
  }
}

// menu.addEventListener("click", mostrarMenu)

// function mostrarMenu(){

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
  
async function consultarProducto(P){
  const producto = axios.get("/api/products/buscarProducto", {
    params: {
      codigo: P,
    },
  });
  return producto;
}

function notification(message) {
  notificacion.classList.add("show-notification");
  notificacion.textContent = message;
  setTimeout(() => {
    notificacion.classList.remove("show-notification");
  }, 3000);
}

async function mostrarProducto (producto){
  const {name, price, type, image, title, marca, description, codigo} = producto.data 
  console.log(producto.data)


  inputNombre.value = name
   inputPrecio.value = price
   inputTitulo.value = title
   inputMarca.value = marca
   inputDescripcion.value = description
   inputID.value = codigo
 inputCategoria.value = type
  
};
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const P = inputID.value;
  const data = new FormData(formulario);

  try {
    const Verificar = await consultarProducto(P);
    if (Verificar) {
      // Editar producto existente
      const editProducto = await editarProducto(data);
      notification(editProducto.data.message);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 5000); // 7000 milisegundos = 7 segundos
    }
  } catch (error) {
    notification("Error al crear o editar producto");
  }
});

async function editarProducto( data ) {
  try {
    const response = await axios.put(`/api/products/editar`, data );
    return response;
  } 
  
  catch (error) {
    console.error("Error al editar producto:", error);
  }
}