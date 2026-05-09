import { configureStore } from '@reduxjs/toolkit'
import auth from "./auth/authSlice"
import admin from "./admin/adminSlice"
import products from "./products/productSlice"
import events from "./events/eventsSlice"
import comments from "./Comments/commentsSlice"
 
const store = configureStore({
    reducer :{auth , admin , products, events , comments}
})

export default store 