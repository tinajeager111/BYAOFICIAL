const linea1 = document.querySelector("#Linea1")
const linea2 = document.querySelector("#Linea2")
const linea3 = document.querySelector("#Linea3")
const btnC = document.querySelector("#btnC")
const formulario = document.querySelector("#formulario");
const inputEmail = document.querySelector("#email");
const inputTelf = document.querySelector("#telefono");
const inputRef = document.querySelector("#referencia");
const inputMonto = document.querySelector("#monto");
const notificacion = document.querySelector(".notification")
const inputfoto = document.querySelector("#foto");
const inputPedido = document.querySelector("#pedido");
const number = document.querySelector("#number")
const listado = document.querySelector("#lista-productos")
let userEmail;
const logoutBtn = document.querySelector("#logOut");
let user 
const a = document.querySelector("#a")
const b = document.querySelector("#b")



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
         user = await consultarUser(userEmail);
        if(user.data.rol === 2){
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Error al consultar el usuario:", error);
        // Maneja el error de forma adecuada
      }
      
      a.classList.remove('hidden')
      
    } catch (error) {
      console.error("Error al verificar el token:", error);
      // Maneja el error de forma adecuada
      localStorage.removeItem("token");
      b.classList.remove('hidden')
    }
    
  } else {
    console.log("El token no existe")
    window.location.href = "/login";
  }

  
  
const URL = new URLSearchParams(window.location.search);

const producto = URL.get('producto');
const precio = URL.get('i');

console.log(precio)


const P = await consultarProducto(producto) 
mostrarProducto(P, precio)
mostrar(user)
});


async function consultarToken(token) {
  try {
    const response = await axios.post('/api/users/verify-token', { token });
    return response.data;
  } catch (error) {
    console.error("Error al verificar el token:", error);
   
  }
}
async function PAGO (correo, referencia){
  console.log("guardando pago")
  try{
    const post = await axios.post("/api/users/guardar", {correo, referencia});
    console.log("agregado al historial" + post.data)
  }
  catch(error){
console.log(error)
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

function notification(message) {
  notificacion.classList.add("show-notification");
  notificacion.textContent = message;
  setTimeout(() => {
    notificacion.classList.remove("show-notification");
  }, 3000);
}
btnC.addEventListener("click", copiarTexto)


async function copiarTexto (e){

    e.preventDefault()

    const textarea = document.createElement("textarea");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";

    // Asignar el texto de las etiquetas <p> al elemento <textarea>
    textarea.value = `${linea1.textContent}${linea2.textContent}${linea3.textContent}`;

    // Agregar el elemento <textarea> al cuerpo del documento
    document.body.appendChild(textarea);

    // Seleccionar el contenido del elemento <textarea>
    textarea.select();

    // Copiar el texto al portapapeles utilizando la API Clipboard
    try {
        await navigator.clipboard.writeText(textarea.value);
        console.log("Texto copiado al portapapeles");
      } catch (err) {
        console.error("Error al copiar el texto al portapapeles:", err);
      }
  
      // Eliminar el elemento <textarea> del cuerpo del documento
      document.body.removeChild(textarea);
    }

    const B = document.querySelector("#B")
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
B.classList.add("dissabled")

  
    if (!inputfoto.value) {
      return notification("Tiene que cargar un archivo antes de enviar");
    }

    console.log("empezando la subida")
  
  // console.log(newProducto)
  const data = new FormData(formulario);
  const codigo = inputPedido.value
  const REF= inputRef.value
console.log(data)
  try {
    console.log("guardando")
   const post1 =  await guardarPago(data);

   console.log(post1)
   console.log(false, post1.data.message)
   const postCantidad = await Contador(codigo)
   const postPAGOuser = await PAGO(userEmail, REF)
   console.log(postPAGOuser.data.message)
   console.log(postCantidad.data.message)
   notification( post1.data.message);

   formulario.reset(); 
   window.location.href='/'

  }
  
  catch (error) {
    console.log("error de subida")
    formulario.reset(); 
    window.location.href='/'
   }

});


async function guardarPago (data) {
  console.log("entrando al post")
  const post = axios.post("/api/pagos/", data)
  return post;
};

async function Contador(codigo) {
  console.log("entrando al post")
  const post = axios.post("/api/products/Contador", { codigo: codigo });
  return post;
}
async function mostrar(user){
  const u = user.data 
 const {email, telefono} = u
inputEmail.value =email
 inputTelf.value = telefono
}

async function mostrarProducto(producto, precio){
const monto = precio
  const P =    producto.data
      const {name, price, image, title, marca, description, codigo} = P
  
  inputMonto.value=monto
  inputPedido.value=codigo

      const div1 = document.createElement('div')
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
            <h5 class="fw-bolder">Monto: Bs.${monto}</h5>
         

        </div>
   
      </div>
      </div>
      </div>`
  
  
    listado.appendChild(div1)
  
  console.log("imprimiendo")
  }


 