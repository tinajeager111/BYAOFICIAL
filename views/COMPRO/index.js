const aSI = document.querySelector("#a")
const bNO = document.querySelector("#b")
const T = document.querySelector("#T")
const logoutBtn = document.querySelector("#logOut");
const listado = document.querySelector("#lista-productos")
const notificacion = document.querySelector(".notification")
const titulo = document.querySelector("#titulo");
const titulo2 = document.querySelector("#titulo2");
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
      try {
        const user = await consultarUser(userEmail);
        if(user.data.rol === 2){
          window.location.href = "/dashboard";
        }
      } catch (error) {
        console.error("Error al consultar el usuario:", error);
        // Maneja el error de forma adecuada
      }
      
      a.classList.remove('VER')
      
    } catch (error) {
      console.error("Error al verificar el token:", error);
     
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

const btnSI = document.querySelector("#btnSI");
const btnNO = document.querySelector("#btnNO");

btnNO.addEventListener('click', (e) => {
  e.preventDefault();
  btnNO.classList.add('disabled');
  btnNO.classList.remove('cursor-pointer')
  bNO.classList.add("hidden")
  aSI.classList.remove("hidden")
  btnSI.classList.remove('disabled');
  T.textContent="Aqui se mostraran tus pagos pendientes por aprobar"
  listado.innerHTML = '';
  mostrarNO();
});

btnSI.addEventListener('click', (e) => {
  e.preventDefault();
  btnSI.classList.add('disabled');
  btnSI.classList.remove('cursor-pointer')
  aSI.classList.add("hidden")
  bNO.classList.remove("hidden")
  btnNO.classList.remove('disabled');
  T.textContent="Aqui se mostraran tus pagos aprobados con exito"
  listado.innerHTML = '';
  mostrarSI();
});


async function mostrarNO(){


  const user = await consultarUser(userEmail);
  console.log(user.data.pagos)

  const listadoP = user.data.pagos
  listadoP.forEach(async (pago) => {
    const C = await consultaREF(pago); // Pasa el objeto pago completo como parámetro
    console.log(C.data)
    const { correo, whatsapp, referencia, monto, comprobante, fecha, aprobado, pedido } = C.data
 
  const P =     await consultarProducto(pedido)
  const product = P.data.name
  const productIMG = P.data.image

  
const U =     await consultarUser(correo)
const nombre = U.data.usuario


        if (aprobado === false) {
        const div1 = document.createElement('div')
      div1.innerHTML = `
      <div class="col mb-5">
      <div class="card h-100">
      
      
      
      
      <!-- Product image-->
    <img class="card-img-top" src="${productIMG}"/>

          <!-- Product details-->
          <div class="card-body p-4">
              <div class="text-center">
                  <!-- Product name-->
                                    <h5 class="fw-bolder">Nombre: ${nombre}</h5>
                                    <h5 class="fw-bolder">Articulo: ${product}</h5>

                  <h5 class="fw-bolder">Fecha: ${fecha}</h5>
                <h5 class="fw-bolder">Referencia: ${referencia}</h5>
                <h5 class="fw-bolder">Monto: ${monto} Bs</h5>
                <h5 class="fw-bolder">Whatsapp: ${whatsapp}</h5>
                <h5 class="fw-bolder">Direccion de correo:</h5>
                <h5 class="fw-bolder">${correo}</h5>

                </div>
       
          </div>
             
              
        
      </div>
      </div>
`

        listado.appendChild(div1)
        }   

})}


async function mostrarSI(){

  
  const user = await consultarUser(userEmail);
  console.log(user.data.pagos)

  const listadoP = user.data.pagos
  listadoP.forEach(async (pago) => {
    const C = await consultaREF(pago); // Pasa el objeto pago completo como parámetro
    console.log(C.data)
    const { correo, whatsapp, referencia, monto, comprobante, fecha, aprobado, pedido } = C.data
 
  const P =     await consultarProducto(pedido)
  const product = P.data.name
  const productIMG = P.data.image

  
const U =     await consultarUser(correo)
const nombre = U.data.usuario

    if (aprobado === true) {
    const div1 = document.createElement('div')
  div1.innerHTML = `
  <div class="col mb-5">
  <div class="card h-100">
  
  
  
  
  <!-- Product image-->
  <img class="card-img-top" src="${productIMG}"/>
 
      <!-- Product details-->
      <div class="card-body p-4">
          <div class="text-center">
  
             <!-- Product details-->
             <div class="card-body p-4">
                 <div class="text-center">
                     <!-- Product name-->
                                       <h5 class="fw-bolder">Nombre: ${nombre}</h5>
                                                                     <h5 class="fw-bolder">Articulo: ${product}</h5>
  
   <h5 class="fw-bolder">Fecha: ${fecha}</h5>
                  <h5 class="fw-bolder">Referencia: ${referencia}</h5>
                  <h5 class="fw-bolder">Monto: ${monto} Bs</h5>
                  <h5 class="fw-bolder">Whatsapp: ${whatsapp}</h5>
                  <h5 class="fw-bolder">Direccion de correo:</h5>
                  <h5 class="fw-bolder">${correo}</h5>
  
              </div>
       
          </div>
                </div>
        
      </div>
      </div>
  `
    listado.appendChild(div1)
    console.log("Listado después de agregar elemento:", listado);
 
  
  
      }})  }
  

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


async function consultaREF(referencia) {
  try {
    const pago1 = await axios.get("/api/pagos/REF", {
      params: {
        referencia: referencia,
      },
    });
    return pago1; // Devuelve el resultado de la consulta
  } catch (error) {
    console.error("Error al consultar la referencia:", error);
    return { error: "Error al consultar la referencia" }; // Maneja el error correctamente
  }
}  