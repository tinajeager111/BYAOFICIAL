
const formulario = document.querySelector("#formulario");
const inputUser = document.querySelector("#nombre");
const inputPass = document.querySelector("#password");
const inputPass2 = document.querySelector("#NewP");
const inputEmail = document.querySelector("#email");
const inputTelf = document.querySelector("#telefono");
const notificacion = document.querySelector(".notification")
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
    try {
    if (token) {
        const userData = await consultarToken(token)
  
        const userEmail = userData.email;
        console.log(userEmail)
        try {
          const user = await consultarUser(userEmail);
          console.log(user)
          inputUser.value = user.data.usuario
         inputTelf.value= user.data.telefono
         inputEmail.value = user.data.email

   
  
        }catch(error){
            window.location.href="/"
            console.error("Error al consultar el usuario:", error);
        }
        
      
  }
}catch(error){
    window.location.href="/login"

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
    const listado = [inputUser.value, inputEmail.value, inputPass.value, inputPass2.value , inputTelf.value ].some((i) => i === "");
    if(listado){
    return notification("Por favor, complete todos los campos");
    }
    const token = localStorage.getItem("token");

    console.log("entrando en la verificación de token");
    
   
  // Verificar token y obtener datos del usuario actual
  const userData = await consultarToken(token);
  const userEmail = userData.email;
  const newEmail = inputEmail.value;

  if (userEmail !== newEmail) {
    // Verificar si el correo electrónico nuevo ya existe en la base de datos
    const emailExist = await consultarUser(newEmail);

    if (emailExist && emailExist.status === 200) {
      // Si el correo electrónico ya existe, verificar si es el mismo que el usuario actual
      if (emailExist.data.email !== userEmail) {
        // Si es el mismo, no hay problema, permitir el registro
        return notification("El correo electrónico ya está en uso");
      }
    } else if (emailExist && emailExist.status === 204) {
      // Si el correo electrónico no existe, permitir el registro
      console.log("El correo electrónico es nuevo, permitir el registro");
    }
  }

  const emailExist = await consultarUser(newEmail);

  if (emailExist && emailExist.data) {
    const userPass = emailExist.data.password;
    console.log(userPass);

    // Verificar que la nueva contraseña sea diferente a la actual
    const Pass = inputPass.value;
    const Pass2 = inputPass2.value;

    if (Pass !== userPass) {
      return notification("Contraseña incorrecta");
    }

    if (Pass === Pass2) {
      return notification("Las contraseñas no pueden ser iguales");
    }}

      // Si no existe, crear un nuevo usuario
      btnSave.disabled = true;
      btnSave.style.cursor = 'not-allowed';
      btnSave.textContent="REALIZANDO CAMBIOS..."

      
    const data= {
        oldE: userEmail,
        nombre: inputUser.value,
        email: inputEmail.value,
        password: inputPass2.value,
        telefono: inputTelf.value,
      };
     
  try{
      const post = await axios.put("/api/users/userEDITAR", data);
      console.log(false, post.data.message);
      notification(post.data.message)
      if(post){
        const token = localStorage.getItem("token") 
        try {
          await axios.post('/api/users/logout', { token});
          localStorage.removeItem("token");
          window.location.href = "/login";
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
        }
      }

  }
     catch (error) {
console.log("Error al editar usuario")
    
  }});

