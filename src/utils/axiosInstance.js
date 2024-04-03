import axios from "axios";
import { baseUrl } from "../helper/baseUrl";

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
