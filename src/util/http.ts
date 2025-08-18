import axios from "axios";
import { ElMessage } from "element-plus";
import { useOpenIdStore } from "@/stores/openId";

export const http = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL as string,
});

http.interceptors.request.use((config: any) => {



  if (config.params) {
    for (const key in config.params) {
      if (typeof config.params[key] === 'object' && config.params[key] !== null) {
        config.params[key] = JSON.stringify(config.params[key]);
      }
    }
  }
  
  return config;
});


