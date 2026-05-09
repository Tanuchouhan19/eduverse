import axios from "axios"

const fetchProducts = async()=>{
    const response = await axios.get("http://localhost:8080/api/product")
    return response.data
}

const productService = {fetchProducts}

export default productService