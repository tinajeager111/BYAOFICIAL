
export const editarProducto = async (productoId) => {
    console.log("se editara" + productoId)
    const editar = await axios.put("/api/products/editar", {
      params: {
codigo: productoId
      },
    });
  
    return editar;
  };