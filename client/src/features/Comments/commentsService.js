import axios from "axios"
import { apiUrl } from "../../config/api"

export const fetchComments = async(eid) => {
    const response = await axios.get(apiUrl(`/api/event/${eid}/comment`))
    return response.data
}

export const createComment = async(comment) => {
    const response = await axios.post(apiUrl(`/api/event/${comment.eid}/comment`),
        { text: comment.text, username: comment.username },
    )
    return response.data
}

const commentService = {fetchComments, createComment}

export default commentService
