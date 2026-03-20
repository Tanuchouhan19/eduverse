import { configureStore } from '@reduxjs/toolkit'
import auth from "./auth/authSlice"
import admin from "./admin/adminSlice"

const store = configureStore({
    reducer :{auth , admin}
})

export default store