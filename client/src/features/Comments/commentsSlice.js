import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import commentService from "./commentsService";

 const commentsSlice = createSlice({
    name : "comments",
    initialState :{
        allComments :[],
        commentsLoading : false ,
        commentsSuccess : false ,
        commentsError : false ,
        commentsErrorMessage : ""
    },
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase(getComments.pending, (state) => {
                state.commentsLoading = true
                state.commentsSuccess = false
                state.commentsError = false
                state.commentsErrorMessage = ""
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.commentsLoading = false
                state.commentsSuccess = true
                state.allComments = action.payload
            })
            .addCase(getComments.rejected, (state, action) => {
                state.commentsLoading = false
                state.commentsSuccess = false
                state.commentsError = true
                state.commentsErrorMessage = action.payload
            })
            .addCase(addComments.pending, (state) => {
                state.commentsLoading = true
                state.commentsSuccess = false
                state.commentsError = false
                state.commentsErrorMessage = ""
            })
            .addCase(addComments.fulfilled, (state, action) => {
                state.commentsLoading = false
                state.commentsSuccess = true
                state.allComments.push(action.payload)
            })
            .addCase(addComments.rejected, (state, action) => {
                state.commentsLoading = false
                state.commentsSuccess = false
                state.commentsError = true
                state.commentsErrorMessage = action.payload
            })
    }
 })

 export default commentsSlice.reducer

//  fetch comments
export const getComments = createAsyncThunk("FETCH/COMMENTS" , async(eid, thunkAPI) => {
    try {
       return await commentService.fetchComments(eid)
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Unable to fetch comments"
        return thunkAPI.rejectWithValue(message)
    }
})


export const addComments = createAsyncThunk("ADD/COMMENT" , async(comment, thunkAPI) => {
    const token = thunkAPI.getState().auth.user?.token

    try {
       return await commentService.createComment(comment, token)
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Unable to add comment"
        return thunkAPI.rejectWithValue(message)
    }
})
