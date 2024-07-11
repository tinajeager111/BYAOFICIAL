
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
 
    }
    
  } else {
    console.log("El token no existe")
    window.location.href = "/login";
  }
  mostrarHTML()
});


async function consultarToken(token) {
  try {
    const response = await axios.post('/api/users/verify-token', { token });
    return response.data;
  } catch (error) {
    console.error("Error al verificar el token:", error);
   
  }
}


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



const listado = document.querySelector("#lista-productos")

import { eliminarProducto} from "./api.js"


listado.addEventListener('click', confirmarEliminar)



//const productos = await consultarProductos()
//productos.insertMany(productos)


function notification(message) {
  notificacion.classList.add("show-notification");
  notificacion.textContent = message;
  setTimeout(() => {
    notificacion.classList.remove("show-notification");
  }, 3000);
}



async function consulta(){
    try {
      const listado = await axios.get('/api/products/listado')
      const {data} = listado
      return data
    } catch (error) {
      console.log(error)
    }
  
  }

  async function obtenerPrecioDolar() {
    try {
      const response = await fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar/unit/bcv');
      const data = await response.json();
      console.log(data.price)
      return data.price;
    } catch (error) {
      console.error('Error al obtener el precio del dólar:', error);
    }
  }
  
  async function mostrarHTML(){
      const listadoP = await consulta()
      const precioDolar = await obtenerPrecioDolar();
  console.log(precioDolar)
  
  
      listadoP.forEach(producto => {
  console.log("imprimiendo")
          const {codigo, type, name, price, image, title, marca, description} = producto 
          const precioBolivares = (price * precioDolar).toFixed(2);
  
  
          if (type === 'skincare') {
          const div1 = document.createElement('div')
        div1.innerHTML = `
        <div class="col mb-5">
        <div class="card h-100">
        
        
        
        
        <!-- Product image-->
            <img class="card-img-top" src="${image}"/>
            <!-- Product details-->
            <div class="card-body p-4">
                <div class="text-center">
                    <!-- Product name-->
                    <h5 class="fw-bolder">${name}</h5>
                    <h5 class="fw-bolder">${marca}</h5>
  
              
                    ${price}$ - ${precioBolivares}Bs
                </div>
         
            </div>
                    <!-- Product actions-->
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center"><a class="btn btn-outline-dark mt-auto text-red-900 eliminar" data-producto="${codigo}">Eliminar producto</a></div>
  
            </div>
          
        </div>
        </div>
  `
  
          listado.appendChild(div1)
          }
  
  })
  
  
  
  
  }
async function confirmarEliminar(e){
  // e.preventDefault()

  if  (e.target.classList.contains('eliminar')){
    const confirmar = confirm('¿Deseas eliminar este producto?')

    const productoId = e.target.dataset.producto
    console.log(productoId)

    if (confirmar){
      try {
        const eliminar = await eliminarProducto(productoId);
        notification(eliminar.data.message)
        setTimeout(() => {
          window.location.reload(); 
        }, 3000); // 3000ms = 3 seconds
      } catch(error){
        return notification("Error al eliminar producto")
      }
    }
  }
}