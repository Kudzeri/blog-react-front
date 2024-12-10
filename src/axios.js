import axios from "axios";

const instance = axios.create({
  baseURL: "https://blog-nodejs-api.onrender.com",
});

instance.interceptors.request.use((config) => {
  if (typeof localStorage !== "undefined" && localStorage.getItem("token")) {
    config.headers.Authorization = localStorage.getItem("token");
  } else {
    console.error("localStorage is not available or token is missing.");
  }
  return config;
});

export default instance;
