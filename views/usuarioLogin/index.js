
const formulario = document.querySelector("#formulario");
const inputPass = document.querySelector("#password");
const inputEmail = document.querySelector("#email");
const notificacion = document.querySelector(".notification")

;


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

function notification(message) {
  notificacion.classList.add("show-notification");
  notificacion.textContent = message;
  setTimeout(() => {
    notificacion.classList.remove("show-notification");
  }, 3000);
}

const emailValidate =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const passValidate = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;


let validarEmail = false;
let validarPass = false;



function Validate(input, validate, rejex) {
  if (input.value === "") {
    input.classList.remove("border-green-600");
    input.classList.remove("border-red-600");
  }

  validate = rejex.test(input.value);

  if (validate) {
    input.classList.add("border-green-600");
    input.classList.remove("border-red-600");
  } else {
    input.classList.remove("border-green-600");
    input.classList.add("border-red-600");
  }
}

formulario.addEventListener("submit", async (e) => {
  e.preventDefault()

  const listado = [inputEmail.value, inputPass.value].some((i) => i === "");
  if(listado){
    return notification("Por favor, complete todos los campos");
  } else {
    try {
      const respuesta = await axios.get("/api/users/consultar-user",{
        params: {
          email: inputEmail.value,
          password: inputPass.value
        }
      })

      if (respuesta.status === 200) {
        const token = respuesta.data.token;
        localStorage.setItem("token", token); // Guardar el token en el almacenamiento local
        window.location.href = respuesta.data.path;
      } else {
        res.status(401).send('ERROR');
      }

    } catch (error) {
      return notification("Verifique si su correo o contraseña estan bien escritas")
    }
  }
});


inputEmail.addEventListener("input", (e) => {
  Validate(e.target, validarEmail, emailValidate);
});

inputPass.addEventListener("input", (e) => {
  Validate(e.target, validarPass, passValidate);
 
});



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
