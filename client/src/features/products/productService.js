import axios from "axios"
import { apiUrl } from "../../config/api"

const fetchProducts = async()=>{
    const response = await axios.get(apiUrl("/api/product"))
    return response.data
}

const productService = {fetchProducts}

export default productService
