const dbUrl= "http://localhost:3000/productos"

export const consultarProductos = async () => {
    try {
     console.log('hola')
      const respuesta = await fetch(dbUrl);
      const resultado = await respuesta.json();
      return resultado;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  //consulta por id
export const consultarProducto = async id=>{
  try{
      const respuesta = await fetch(`${dbUrl}/${id}`)
      const resultado = await respuesta.json()
      return resultado
  }
  catch(error){
console.log(error)
  }
}

