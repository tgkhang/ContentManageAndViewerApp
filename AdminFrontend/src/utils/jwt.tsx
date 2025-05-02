import axiosInstance from "./axios";


export const isValidToken = (accessToken: string | null): boolean => {
    if (!accessToken) return false;
    return true;
}

export const setSession = (accessToken: string | null): void => {
    if(accessToken){
        localStorage.setItem("accessToken", accessToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    }
    else {
        localStorage.removeItem("accessToken");
        delete axiosInstance.defaults.headers.common.Authorization;
    }
}