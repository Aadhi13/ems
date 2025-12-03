import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  //Put backend URL on the .env file
  withCredentials: false,
});

// TODO: attach auth token when add JWT
// api.interceptors.request.use((config) => { ... });

export default api;