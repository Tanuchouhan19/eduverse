import axios from "axios"

export const fetchComments = async(eid) => {
    const response = await axios.get("/api/event" + eid + "/comment")   
    console.log(response.data)
    return response.data
}  

const commentService = {fetchComments}

export default commentService