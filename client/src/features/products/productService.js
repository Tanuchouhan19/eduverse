import axios from "axios"

const fetchProducts = async()=>{
    const response = await axios.get("/api/product")
    return response.data
}

const productService = {fetchProducts}

export default productService
