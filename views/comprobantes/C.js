
const logoutBtn = document.querySelector("#logOut");
const aSI = document.querySelector("#a")
const bNO = document.querySelector("#b")

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
  // async function mostrarUser(user) {
  //   if (user.data) {
  //     const { usuario, email, password, telefono, rol } = user.data;
  //     titulo.innerHTML = `Bienvenid@ ${usuario}`;
  //   } 
  // }
  
  // logoutBtn.addEventListener("click", (e) => {
    // e.preventDefault();
    // localStorage.removeItem("user");
  //   window.location.href = "/";
  // });
  
  const listado = document.querySelector("#lista-productos")

  const btnSI = document.querySelector("#btnSI");
  const btnNO = document.querySelector("#btnNO");
  const T = document.querySelector("#T");


  btnNO.addEventListener('click', (e) => {
    e.preventDefault();
    btnNO.classList.add('disabled');
    btnNO.classList.remove('cursor-pointer')
    bNO.classList.add("hidden")
    aSI.classList.remove("hidden")
    btnSI.classList.remove('disabled');
    T.textContent="Aqui se mostraran pagos pendientes por aprobar"
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
    T.textContent="Aqui se mostraran pagos aprobados con exito"
    listado.innerHTML = '';
    mostrarSI();
  });
  
  
//const productos = await consultarProductos()
//productos.insertMany(productos)


async function consulta(){ 
    try {
      const listado = await axios.get('/api/pagos/listado')
      const {data} = listado
      return data
    } catch (error) {
      console.log(error)
    }
  }

async function mostrarNO(){

    const listadoP = await consulta()
   
//     nombre: String,
//     correo: String,
//     whatsapp: String,
//     referencia: String,
//     monto: String,
//   comprobante: String, 
//   fecha: String,
//   aprobado: Boolean, 

    listadoP.forEach( async (pago) => {

        const {correo,  whatsapp, referencia, monto, comprobante, fecha, aprobado, pedido} = pago 

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
        <img class="card-img-top" src="${comprobante}" id="comprobante-img"/>
    <img class="card-img-top" src="${productIMG}" id="comprobante-alt-img" style="display: none;"/>
    <label class="flex items-center">
      <input type="checkbox" id="toggle-img" />
      <span id="N" class="ml-2">Mostrar producto</span>
    </label>
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
                  <!-- Product actions-->
                  <div class="flex justify-center items-center p-4">
                  <div class="rounded-md border border-indigo-500 bg-gray-50 shadow-md w-36">
                    <button id="btn-aprobar" class="flex flex-col items-center gap-2 cursor-pointer">
                      <div id="svg-container">
                      <svg fill="#1eb300" viewBox="0 0 200 200" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  width="36" height="36" stroke="#1eb300"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title></title><path d="M100,15a85,85,0,1,0,85,85A84.93,84.93,0,0,0,100,15Zm0,150a65,65,0,1,1,65-65A64.87,64.87,0,0,1,100,165Zm25-91.5-29,35L76,94c-4.5-3.5-10.5-2.5-14,2s-2.5,10.5,2,14c6,4.5,12.5,9,18.5,13.5,4.5,3,8.5,7.5,14,8,1.5,0,3.5,0,5-1l3-3,22.5-27c4-5,8-9.5,12-14.5,3-4,4-9,.5-13L138,71.5c-3.5-2.5-9.5-2-13,2Z"></path></g></svg>
                      </div>
                      <span class="text-gray-600 font-medium">Aprobar pago</span>
                    </button>
                  </div>
                  <div class="m-2 rounded-md border border-indigo-500 bg-gray-50 shadow-md w-36">
                    <button id="btn-rechazar" class="flex flex-col items-center gap-2 cursor-pointer">
                      <div id="svg-container">
      
                      <svg fill="#b30000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="36" height="36" stroke="#b30000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"></path></g></svg>
      <span class="text-gray-600 font-medium">Rechazar pago</span>
                   
                  </button>
                  </div>
                </div>
        
      </div>
      </div>
`
listado.appendChild(div1)

const   Img = div1.querySelector("#toggle-img")
Img.addEventListener('change', () => {
  const comprobanteImg =div1.querySelector('#comprobante-img');
  const comprobanteAltImg =div1.querySelector('#comprobante-alt-img');

  if (Img.checked) {
    comprobanteImg.style.display = 'none';
    comprobanteAltImg.style.display = 'block';
  } else {
    comprobanteImg.style.display = 'block';
    comprobanteAltImg.style.display = 'none';

  }
});
const btnRechazar = div1.querySelector('#btn-rechazar')
const btnAprobar = div1.querySelector('#btn-aprobar');

btnAprobar.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log('Aprobar pago: '+  referencia);
  await aprobarPago(referencia); 
  console.log("agregar a historial")
  await historial(correo, pedido)
  setTimeout(() => {
    window.location.reload(); 
  }, 3); 

});

btnRechazar.addEventListener('click', async (e)=>{
  e.preventDefault();
  console.log('Rechazar pago')

  await rechazar(referencia)
  setTimeout(() => {
    window.location.reload(); 
  }, 3);
})

        listado.appendChild(div1)
        }

})


}   
async function rechazar(referencia) {
  const confirmar = confirm('¿Deseas eliminar este pago?')
  if(confirmar){
  try{
 const Delete = await axios.delete('/api/pagos/delete', {params: {referencia}})
 console.log('Pago eliminado:', Delete.data.message);

  } 
  catch (error) {
    console.error('Error al aprobar pago:', error);
  }}
}

async function aprobarPago(referencia) {
  try {
    const response = await axios.post('/api/pagos/aprobar', {referencia: referencia} );
    console.log('Pago aprobado:', response.data);
    
  } catch (error) {
    console.error('Error al aprobar pago:', error);
  }
}

async function historial (correo, pedido){
  console.log("guardando historial")
  try{
    const post = await axios.post("/api/users/historial", {correo, pedido});
    console.log("agregado al historial" + post.data)
  }
  catch(error){
console.log(error)
  }
}
async function mostrarSI(){

  const listadoP = await consulta()
 
//     nombre: String,
//     correo: String,
//     whatsapp: String,
//     referencia: String,
//     monto: String,
//   comprobante: String, 
//   fecha: String,
//   aprobado: Boolean, 

listadoP.forEach( async (pago) => {

  const {correo,  whatsapp, referencia, monto, comprobante, fecha, aprobado, pedido} = pago 

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
  <img class="card-img-top" src="${comprobante}" id="comprobante-img"/>
<img class="card-img-top" src="${productIMG}" id="comprobante-alt-img" style="display: none;"/>
<label class="flex items-center">
<input type="checkbox" id="toggle-img" />
      <span id="N" class="ml-2">Mostrar producto</span>
</label>
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

const   Img = div1.querySelector("#toggle-img")
Img.addEventListener('change', () => {
  const comprobanteImg =div1.querySelector('#comprobante-img');
  const comprobanteAltImg =div1.querySelector('#comprobante-alt-img');

  if (Img.checked) {
    comprobanteImg.style.display = 'none';
    comprobanteAltImg.style.display = 'block';
  } else {
    comprobanteImg.style.display = 'block';
    comprobanteAltImg.style.display = 'none';

  }
});
      
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
