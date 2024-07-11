const listado = document.querySelector("#lista-productos")

const a = document.querySelector("#a")
const b = document.querySelector("#b")
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
    b.classList.remove('VER')
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

//const productos = await consultarProductos()
//productos.insertMany(productos)


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

        const {codigo, type, name, price, image, title, marca, description} = producto 
        const precioBolivares = (price * precioDolar).toFixed(2);


        if (type === 'maquillaje') {
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
              <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="/ver?producto=${codigo}">Ver producto</a></div>

          </div>
        
      </div>
      </div>
`

        listado.appendChild(div1)
        }

})




}