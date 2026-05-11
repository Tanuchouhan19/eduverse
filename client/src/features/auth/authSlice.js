import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const userExist = JSON.parse(localStorage.getItem('user'))
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: userExist || null,
        isLoading: false,
        isSuccess: false,
        isError: false,
        message: ""
    },
    reducers: {},
    extraReducers: builder => {
        builder

        // register case
        .addCase(registerUser.pending, (state)=> {
            state.isLoading = true
            state.isSuccess = false
            state.isError = false
        })
         .addCase(registerUser.fulfilled, (state , action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
            state.isError = false
        })
         .addCase(registerUser.rejected, (state , action)=> {
            state.isLoading = false
            state.isSuccess = false
            state.isError = true
            state.message = action.payload
        })

        // logincase

        .addCase(loginUser.pending, (state)=> {
            state.isLoading = true
            state.isSuccess = false
            state.isError = false
        })
         .addCase(loginUser.fulfilled, (state , action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
            state.isError = false
        })
         .addCase(loginUser.rejected, (state , action)=> {
            state.isLoading = false
            state.isSuccess = false
            state.isError = true
            state.message = action.payload
        })

        // logout case
         .addCase(logoutUser.fulfilled, (state)=> {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ""
            state.user = null
        })
    }
})


export default authSlice.reducer

// register user
export const registerUser =  createAsyncThunk("AUTH/REGISTER" , async (formData , thunkAPI)=>{
    try {
        return await authService.register(formData)
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Registration failed"
        return thunkAPI.rejectWithValue(message)
    }
})


// login user
export const loginUser =  createAsyncThunk("AUTH/LOGIN" , async (formData , thunkAPI)=>{
    try {
        return await authService.login(formData)
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Login failed"
        return thunkAPI.rejectWithValue(message)
    }
})



// Logout user
export const logoutUser =  createAsyncThunk("AUTH/LOGOUT" , async ( )=>{
    localStorage.removeItem('user')
})
