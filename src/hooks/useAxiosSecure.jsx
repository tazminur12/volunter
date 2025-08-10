import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://volunteerhub-server.vercel.app",
});


let interceptorsAdded = false;

const useSecureAxios = () => {
  if (!interceptorsAdded) {
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );


    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 403) {
          // Optional: handle token invalid
        }
        return Promise.reject(error);
      }
    );

    interceptorsAdded = true; 
  }

  return instance;
};

export default useSecureAxios;