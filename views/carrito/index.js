const logoutBtn = document.querySelector("#logOut");
const listado = document.querySelector("#lista-productos")
const notificacion = document.querySelector(".notification")



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

        
listado.addEventListener('click', (event) => confirmarEliminar(event, userEmail))

try {
  const user = await consultarUser(userEmail);

console.log(user)

        
  if (Array.isArray(user.data.guardados) && user.data.guardados.length > 0) {
    console.log(user.data.guardados)
const titulo = document.querySelector("#titulo");
const titulo2 = document.querySelector("#titulo2");

    const usuario = user.data.usuario
    const productos = user.data.guardados

        titulo.innerHTML = `Bienvenid@ ${usuario}`;
        titulo2.innerHTML = 'Aqui se mostrarán los productos que guardes';

        console.log('hola '+ usuario)
      
        productos.forEach(async (idProducto) => {
          try {
            const producto = await consultarProducto(idProducto);
            const { data } = producto;
            const { image, name, marca, price, codigo } = data;
            const precioDolar = await obtenerPrecioDolar();
            const precioBolivares = (price * precioDolar).toFixed(2);
        
            const div1 = document.createElement('div');
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
<div class="text-center"><a class="btn btn-outline-dark mt-auto" href="/ver?producto=${codigo}">Ver producto</a></div>

</div>
<div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
<div class="text-center"><a class="btn btn-outline-dark mt-auto" href="/pago?i=${precioBolivares}&producto=${codigo}">COMPRAR</a></div>

</div>
<div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center"><a class="btn btn-outline-dark mt-auto eliminar" data-producto="${codigo}">Eliminar</a></div>
              </div>
</div>
</div>
            `;

            listado.appendChild(div1);
          } catch (error) {
            console.error("Error al consultar el producto:", error);
          }
        });
            } else {
    // El array guardados está vacío, mostrar mensaje HTML
    const usuario = user.data.usuario

  console.log("el carrito esta vacio")
  titulo.innerHTML = `Bienvenid@ ${usuario}`;
        titulo2.innerHTML = 'Cuando guardes un producto aparecera aqui';

  }


    
          if(user.data.rol === 2){
            window.location.href = "/login";
          }
        } catch (error) {
          console.error("Error al consultar el usuario:", error);
          // Maneja el error de forma adecuada
        }
        
        
      } catch (error) {
        console.error("Error al verificar el token:", error);
        // Maneja el error de forma adecuada
        localStorage.removeItem("token");
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
  

function notification(message) {
  notificacion.classList.add("show-notification");
  notificacion.textContent = message;
  setTimeout(() => {
    notificacion.classList.remove("show-notification");
  }, 3000);
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



  
async function consultarProducto(idProducto){
  const producto = axios.get("/api/products/buscarProducto", {
    params: {
      codigo: idProducto,
    },
  });
  return producto;
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

async function confirmarEliminar(event, userEmail){

  // e.preventDefault()

 if  (event.target.classList.contains('eliminar')){
   const confirmar = confirm('¿Deseas eliminar este producto?')

    const productoId = event.target.dataset.producto
    console.log(productoId)

   if (confirmar){
    try {
     
      const eliminar = await eliminarProducto(productoId, userEmail );
notification(eliminar.data.message)
}catch(error){
console.log(error)}
}}
}

async function eliminarProducto(productoId, userEmail) {
  console.log("enviando datos: " + userEmail + productoId)
  try {
    const response = await axios.delete("/api/users/eliminarCarrito", {
      params:{
      userEmail,
     productoId,
  }});
    notification("Producto eliminado");
    setTimeout(() => {
      window.location.reload(); 
    }, 6000); 

    return response
  } catch (error) {
console.log(error)  }
  }