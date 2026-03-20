import axios from "axios"

const API_URL = "/api/admin/"


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
       const response = await axios.get("/api/event" )
    return response.data
}

const fetchAllListings = async () => {
    const response = await axios.get("/api/product" )
    return response.data
}



const updateListing = async (selectedListing ,token) =>{
  let options = {
    headers : {
      authorization : `Bearer ${token}`
    }
  }
  const response = await axios.put("/api/admin/product/" + selectedListing._id ,selectedListing ,options)
  console.log(response.data)
  return response.data
}


const updateUser = async (updatedUser ,token) =>{
  let options = {
    headers : {
      authorization : `Bearer ${token}`
    }
  }
  const response = await axios.put("/api/admin/users/" + updatedUser._id ,updatedUser ,options)
  console.log(response.data)
  return response.data
}

const adminService = {fetchAllUsers , fetchAllEvents ,fetchAllListings, updateListing ,updateUser}

export default adminService