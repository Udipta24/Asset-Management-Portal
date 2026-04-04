import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true // IMPORTANT: send cookies
});
// console.log(import.meta.env.VITE_API_URL);
export default API;
