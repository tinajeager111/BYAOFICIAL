const a = document.querySelector("#a")
const logoutBtn = document.querySelector("#logOut");
const listado = document.querySelector("#lista-productos")
const notificacion = document.querySelector(".notification")

let userEmail;

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
    try{
    console.log("entrando en la verificación de token")
    if (token) {
      try {
        const userData = await consultarToken(token)
        userEmail = userData.email;

        const user = await consultarUser(userEmail);

        console.log(user)

        
  if (Array.isArray(user.data.compras) && user.data.compras.length > 0) {
    console.log(user.data.compras)
const titulo = document.querySelector("#titulo");
const titulo2 = document.querySelector("#titulo2");

    const usuario = user.data.usuario
    const productos = user.data.compras

        titulo.innerHTML = `Bienvenid@ ${usuario}`;
        titulo2.innerHTML = 'Aqui se mostrarán tus compras';

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
     <div class="col mb-5 pt-3">
      <div class="card h-100">
      
      <img class="card-img-top" src="${image}"/>
      <!-- Product details-->
      <div class="card-body p-4">
          <div class="text-center">
              <!-- Product name-->
              <h5 class="fw-bolder">Producto: ${name}</h5>
              <h5 class="fw-bolder">Marca: ${marca}</h5>
            <h5 class="fw-bolder">Monto: Bs.${precioBolivares} - $${price}</h5>
         

        </div>
   
      </div>
      </div>
      </div>`;

            listado.appendChild(div1);
          } catch (error) {
            console.error("Error al consultar el producto:", error);
          }
        });}
             else {
    // El array guardados está vacío, mostrar mensaje HTML
  console.log("el no hay pagos aprobados")
  titulo.innerHTML = `Bienvenid@ ${usuario}`;
        titulo2.innerHTML = 'Cuando un administrador confirme tu pago aparecera aqui';

  }


    
          if(user.data.rol === 2){
            window.location.href = "/login";
          }
        } catch (error) {
          console.error("Error al consultar el usuario:", error);
          // Maneja el error de forma adecuada
        }
        
    
      } else {
      console.log("El token no existe")
      window.location.href = "/login";
      }
}catch (error) {
        console.error("Error al verificar el token:", error);
        // Maneja el error de forma adecuada
      
      
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