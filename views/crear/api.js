

export const guardarProducto = async (data) => {
    const post = axios.post("/api/products/", data)
    return post;
  };
  