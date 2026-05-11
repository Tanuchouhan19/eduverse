import axios from "axios"
import { apiUrl } from "../../config/api"

const fetchEvents = async ()=>{
    const response = await axios.get(apiUrl("/api/event"))
    return response.data
}

const fetchEvent = async (eid)=>{
    const response = await axios.get(apiUrl(`/api/event/${eid}`))
    return response.data
}

const eventService = {fetchEvents , fetchEvent}

export default eventService
