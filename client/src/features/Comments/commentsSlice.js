import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import commentService from "./commentsService";

 const commentsSlice = createSlice({
    name : "comments",
    initialState :{
        allcomments :[],
        commentsLoading : false , 
        commentsSuccess : false ,
        commentsError : false ,
        commentsErrorMessage : ""
    },
    reducers : {},
    extraReducers : (builder) => {}
 })

 export default commentsSlice.reducer

//  fetch comments
export const getComments = createAsyncThunk("FETCH/COMMENTS" , async(eid) => {
    try {
       return await commentService.fetchComments(eid) 
    } catch (error) {
        const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})