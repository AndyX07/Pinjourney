import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: false,
})

api.interceptors.request.use(request=>{
    const accessToken = localStorage.getItem("accessToken");
    if(accessToken){
        request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(response=>response,
    async error=>{
        const originalRequest = error.config;
        if(error.response && error.response.status===401 && !originalRequest._retry){
            originalRequest._retry= true;
            try{
                const refreshToken = localStorage.getItem("refreshToken");
                const response = await axios.post("http://localhost:8000/api/auth/refresh/", {refresh: refreshToken});
                const newAccessToken = response.data.access;
                localStorage.setItem("accessToken", newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            }
            catch (refreshError){
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)

export default api;