const listado = document.querySelector("#lista-productos")
const notificacion = document.querySelector(".notification")
const titulo = document.querySelector("#titulo")
const a = document.querySelector("#a")
const b = document.querySelector("#b")
const logoutBtn = document.querySelector("#logOut");
let P;
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
  
  console.log("entrando en la verificación de token")
  if (token) {
    try {
      const userData = await consultarToken(token)
     userEmail = userData.email;
      const URL = new URLSearchParams(window.location.search);

      const producto = URL.get('producto');
     
       P = await consultarProducto(producto) 
     
      mostrarProducto(P)
     // GUARDAR(P, userEmail)
     
      try {
        const user = await consultarUser(userEmail);
        if(user.data.rol === 2){
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Error al consultar el usuario:", error);
        // Maneja el error de forma adecuada
      }
      
      a.classList.remove('VER')
      
    } catch (error) {
      console.error("Error al verificar el token:", error);
      // Maneja el error de forma adecuada
      localStorage.removeItem("token");
      b.classList.remove('VER')
    }
    
  } else {
    console.log("El token no existe")
    window.location.href = "/login";  }
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

async function mostrarProducto(producto) {
  const P = producto.data;
  const { name, price, image, title, marca, description, codigo } = P;
  const precioDolar = await obtenerPrecioDolar();
  const precioBolivares = (price * precioDolar).toFixed(2);


  titulo.innerHTML = `${title}`;
  const div1 = document.createElement("div");
  div1.innerHTML = `
    <div class="contenedor">
      <section>
        <img src="${image}" class="imagen-producto" alt="producto">
      </section>

      <section class="texto-producto">
        <p class="lead fw-normal text-white-50 mb-0 pt-3">${description}</p>
        <p class="lead fw-normal text-white-50 mb-0">Marca: ${marca}</p>
        <p class="lead fw-normal text-white-50 mb-0">Precio en dolares: $${price}</p>
        <p class="lead fw-normal text-white-50 mb-0">Precio en bolívares: Bs. ${precioBolivares}</p>

        <div class="p-4">
          <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center"><a class="text-white submit comprar" href="/pago?i=${precioBolivares}&producto=${codigo}">COMPRAR</a></div>
            <div class="text-center"> <button type="submit" class="submit" id="save">
              AGREGAR AL CARRITO
            </button></div>
          </div>
        </div>
      </section>
    </div>
  `;
  listado.appendChild(div1);

  console.log("imprimiendo");


  const btnSave  = document.querySelector("#save");
btnSave.addEventListener("click", () => GUARDAR());


    
  const user = await consultarUser(userEmail);
  const guardados = user.data.guardados;


  if (guardados.includes(codigo)) {
    btnSave.disabled = true;
    btnSave.style.cursor = 'not-allowed';
    btnSave.textContent = "YA GUARDASTE ESTE PRODUCTO";
  }}

  
  async function GUARDAR(){

    const userC = userEmail
    console.log("el email es " + userC)
    const URL = new URLSearchParams(window.location.search);

    const producto = URL.get('producto');
   
     const P1 = await consultarProducto(producto) 


    console.log("guardando")
   const newGuardado = P1.data.codigo
  console.log(newGuardado)
   try{
    const post = await axios.post("/api/users/carrito", {userC, newGuardado});
    console.log(false, post.data.message);
    notification(post.data.message)
    setTimeout(() => {
      window.location.reload(); 
    }, 3); 
  }
   catch (error) {
  return notification("Error al guardar producto")
  }
  }