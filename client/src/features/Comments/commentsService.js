import axios from "axios"
import { apiUrl } from "../../config/api"

export const fetchComments = async(eid) => {
    const response = await axios.get(apiUrl(`/api/event/${eid}/comment`))
    return response.data
}

export const createComment = async(comment, token) => {
    const response = await axios.post(
        apiUrl(`/api/event/${comment.eid}/comment`),
        { text: comment.text },
        {
            headers: {
                authorization: `Bearer ${token}`,
            },
        },
    )
    return response.data
}

const commentService = {fetchComments, createComment}

export default commentService
