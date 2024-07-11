const titulo = document.querySelector("#titulo");
const menu = document.querySelector("#navbarSupportedContent")
const a = document.querySelector("#a")
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

        mostrarUser(user)
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
async function mostrarUser(user) {
  if (user.data) {
    const { usuario} = user.data;
    titulo.innerHTML = `Bienvenid@ ${usuario}`;
  } 
}
