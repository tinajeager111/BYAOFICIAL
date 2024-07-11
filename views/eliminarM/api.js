
//agregar/ crear  un producto
export const nuevoProducto = async  producto =>{

    //registro de nuevo producto
    try{
       await fetch(url,{
            method:'POST',
            body: JSON.stringify(producto),
            headers:{
                'Content-Type':'application/json'
            }
        })
    }
    catch (error){
        console.log(error)
    }

}


export const eliminarProducto = async (productoId) => {
    console.log("se elimanara" + productoId)
    const eliminar = await axios.delete("/api/products/eliminar", {
      params: {
codigo: productoId
      },
    });
  
    return eliminar;
  };
  


//eliminar un producto
export const eliminarproducto = async id =>{
try{
await fetch(`${url}/${id}`,{
    method:'DELETE'
})
}
catch(error){
//console.log(error)
}
}


//actualizar / editar un producto\
export const editarProducto = async producto =>{
try{
await fetch(`${url}/${producto.id}`, {
    method:'PUT',
    body:JSON.stringify(producto),
    headers:{
        'Content-Type':'application/json'
    }
})
}
catch(error){
//console.log(error)
}
}


//consulta de todos los items
export const consultarProductos = async ()=>{
    try{
        const respuesta = await fetch(url)
        const resultado = await respuesta.json()
        return resultado
    }
    catch(error){
//console.log(error)
    }
}


//consulta por id
export const consultarProducto = async id=>{
    try{
        const respuesta = await fetch(`${url}/${id}`)
        const resultado = await respuesta.json()
        return resultado
    }
    catch(error){
console.log(error)
    }
}