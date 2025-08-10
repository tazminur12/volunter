import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
});

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;