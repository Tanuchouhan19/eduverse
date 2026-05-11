import axios from "axios";
import { apiUrl } from "../../config/api";

const API_URL = apiUrl("/api/auth/");

const register = async (formData) => {
  const response = await axios.post(API_URL + "register", formData);
  localStorage.setItem('user',JSON.stringify(response.data))
  return response.data;
};

const login = async (formData) => {
  const response = await axios.post(API_URL + "login", formData);
  localStorage.setItem('user',JSON.stringify(response.data))
  return response.data;
};

const authService = {
  register,login
};

export default authService;
