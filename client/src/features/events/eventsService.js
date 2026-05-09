import axios from "axios"

const fetchEvents = async ()=>{
    const response = await axios.get('/api/event')
    return response.data
}

const fetchEvent = async (eid)=>{
    const response = await axios.get('/api/event/'+ eid)
    return response.data
}

const eventService = {fetchEvents , fetchEvent}

export default eventService