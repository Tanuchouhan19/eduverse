import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import productService from "./productService";

const productSlice = createSlice({
    name : "products",
    initialState : {
        allProducts : [],
        product : {},
        productLoading : false,
        productSuccess : false,
        productError : false,
        productErrorMessage : ""


    },
    reducers : {},
    extraReducers : (builder) => {
      builder
        .addCase(getProducts.pending , (state,action)=>{
            state.productLoading = true
            state.productSuccess = false
            state.productError = false
        }) 
        .addCase(getProducts.fulfilled , (state,action)=>{
            state.productLoading = false
            state.allProducts = action.payload
            state.productSuccess = true
            state.productError = false
        }) 

        .addCase(getProducts.rejected , (state,action)=>{
            state.productLoading = false
            state.productSuccess = false
            state.productError = true
            state.productErrorMessage = action.payload
        }) 

        
    }
}
)

export default productSlice.reducer

// fetch products 

export const getProducts = createAsyncThunk("FETCH/PRODUCTS" , async(_ , thunkAPI)=>{
    try {
        return await productService.fetchProducts()
    } catch (error) {
         const message = error.response.data.message
         return thunkAPI.rejectWithValue(message)
    }
}) 