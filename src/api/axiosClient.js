import axios from "axios";
const axiosClient = axios.create({
  baseURL: "https://api.nemthangloivn.vn",
  // baseURL: "http://localhost:5000",
  withCredentials: true,
});

export default axiosClient;
