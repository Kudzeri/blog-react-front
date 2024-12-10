import axios from "axios";

const instance = axios.create({
  baseURL: "https://blog-nodejs-api.onrender.com",
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = localStorage.getItem("token");

  return config;
});

export default instance;
