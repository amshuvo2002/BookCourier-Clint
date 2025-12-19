import axios from 'axios';
import { getAuth } from "firebase/auth";

const axiosSecure = axios.create({
  baseURL: "https://book-courier-surver.vercel.app/" ,
});

axiosSecure.interceptors.request.use(async (config) => {
  const auth = getAuth();
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Token fetch error:", error);
    }
  }
  return config;
});


axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;