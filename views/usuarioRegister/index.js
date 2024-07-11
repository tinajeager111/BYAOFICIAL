
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
          window.location.href = "/login";
        }

        if(user.data.rol === 2){
          window.location.href = "/dashboard";
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
    });
    console.log("Response data:", user.data);
    return user;
  } catch (error) {
    console.error("Error al consultar el usuario:", error);
  }
}

const formulario = document.querySelector("#formulario");
const inputUser = document.querySelector("#nombre");
const inputPass = document.querySelector("#password");
const confirmPass = document.querySelector("#confirmpass");
const inputEmail = document.querySelector("#email");
const inputTelf = document.querySelector("#telefono");
const notificacion = document.querySelector(".notification")



function notification(message) {
  notificacion.classList.add("show-notification");
  notificacion.textContent = message;
  setTimeout(() => {
    notificacion.classList.remove("show-notification");
  }, 3000);
}

const btnSave = document.querySelector("#save")

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
 
  // const email = inputEmail.value;

  // try {
  //   // Verificar si el email ya existe en la base de datos
  //   const response = await axios.get("/api/users", d, { params: { email } });
  //   const userExists = response.data;

  //   if (userExists) {
  //     console.log("El email ya existe");
  //    return  notification("El email ya existe");

  //    ;
  //   }
  const listado = [inputUser.value, inputEmail.value, inputPass.value, confirmPass.value , inputTelf.value ].some((i) => i === "");
  if(listado){
  return notification("Por favor, complete todos los campos");
  }

  const exist = inputEmail.value
  const emailExist = await consultarUser(exist)

  if(emailExist && emailExist.status === 200){
    return notification("El correo ya está en uso");
  }

  if(emailExist.status === 204){
    // Si no existe, crear un nuevo usuario
 
    btnSave.disabled = true;
    btnSave.style.cursor = 'not-allowed';
    btnSave.textContent="REALIZANDO REGISTRO..."

    const newUser = {
      nombre: inputUser.value,
      email: inputEmail.value,
      password: inputPass.value,
      telefono: inputTelf.value,
      rol: 1
    };
try{
    const post = await axios.post("/api/users", newUser);
    console.log(false, post.data.message);
    notification(post.data.message)

        formulario.reset(); 

        window.location.href = "/login";

}
   catch (error) {
return notification("Error al crear usuario")
  }
}});