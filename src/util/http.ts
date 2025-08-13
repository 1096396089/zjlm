import axios from "axios";
import { ElMessage } from "element-plus";
import { useOpenIdStore } from "@/stores/openId";

export const http = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL as string,
});

http.interceptors.request.use((config: any) => {
  // ensure openId is included in every request as query param (or header if desired)
  try {
    const store = useOpenIdStore()
    const openId = store.openId
    if (openId) {
      config.params = { ...(config.params || {}), openId }
    }
  } catch (e) {
    // pinia may not be available in some non-vue contexts; ignore
  }
  // config.headers = {
  //   Authorization: "Bearer " + localStorage.token,
  // };
  
  if (config.params) {
    for (const key in config.params) {
      if (typeof config.params[key] === 'object' && config.params[key] !== null) {
        config.params[key] = JSON.stringify(config.params[key]);
      }
    }
  }
  
  return config;
});

// http.interceptors.response.use(
//   (res) => {
//     return res;
//   },
//   (err) => {
//     console.log();
   
//     if (err.response?.status == 401) {
//       ElMessage.error('登录过期，请重新登录');
//       setTimeout(()=>{
//         localStorage.clear();
//         router.push("/login");
//       },1500)
//     } else {
//       ElMessage.error(err.response?.data.message || "请稍后再试");
//     }
//     return Promise.reject(err);
//   }
// );
