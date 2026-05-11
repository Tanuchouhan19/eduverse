import axios from "axios"
import { apiUrl } from "../../config/api"

const API_URL = apiUrl("/api/admin/")


const fetchAllUsers = async (token) => {
// this option is a object
    let options = {
      headers : {
        authorization : `Bearer ${token}`
      }
    }

    const response = await axios.get(API_URL + "users" , options)
    return response.data
}

const fetchAllEvents = async () => {
       const response = await axios.get(apiUrl("/api/event") )
    return response.data
}

const fetchAllListings = async () => {
    const response = await axios.get(apiUrl("/api/product") )
    return response.data
}



const updateListing = async (selectedListing ,token) =>{
  let options = {
    headers : {
      authorization : `Bearer ${token}`
    }
  }
  const response = await axios.put(apiUrl("/api/admin/product/" + selectedListing._id) ,selectedListing ,options)
  console.log(response.data)
  return response.data
}


const updateUser = async (updatedUser ,token) =>{
  let options = {
    headers : {
      authorization : `Bearer ${token}`
    }
  }
  const response = await axios.put(apiUrl("/api/admin/users/" + updatedUser._id) ,updatedUser ,options)
  console.log(response.data)
  return response.data
}

const createEvent = async (FormData , token)=>{
  let options = {
      headers : {
         authorization : `Bearer ${token}`
    }
  }
  const response = await axios.post(apiUrl("/api/admin/event") , FormData ,options)
  return response.data
}

const update = async (updatedEvent , token)=>{
  let options = {
      headers : {
         authorization : `Bearer ${token}`
    }
  }
  const response = await axios.put(apiUrl("/api/admin/event/" + updatedEvent._id) , updatedEvent ,options)
  console.log(response.data)
  return response.data
}


const adminService = {fetchAllUsers , fetchAllEvents ,fetchAllListings, updateListing ,updateUser, createEvent,update}

export default adminService
