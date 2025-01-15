import axios from "axios";

const axiosIstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

axiosIstance.interceptors.request.use(
  (config) => {
    if (!config.url.includes("/auth")) {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers["Authorization"] = token;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosIstance;
