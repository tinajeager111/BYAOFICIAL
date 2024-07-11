


 
  //consulta por id
export const consultarProducto = async name=>{
  try{
      const respuesta = await  axios.get(`/api/products/listado/`)
      const resultado = await respuesta
      return resultado
  }
  catch(error){
console.log(error)
  }
}


async function consulta(){
    try {
      const listado = await axios.get('/api/products/listado')
      const {data} = listado
      return data
    } catch (error) {
      console.log(error)
    }
  
  }
