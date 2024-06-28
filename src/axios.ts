import axios, { AxiosHeaders, type AxiosRequestConfig } from "axios";

export function setToken(token: string)
{
    
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
    /*(config.headers as AxiosHeaders).set("Access-Control-Allow-Origin", 'true');
    (config.headers as AxiosHeaders).set("Content-Type", 'application/json');
    (config.headers as AxiosHeaders).set("credentials", 'same-origin');*/
}

const config: AxiosRequestConfig = {
    proxy: false,
    //withCredentials: true,
    headers: new AxiosHeaders({'Access-Control-Allow-Origin':'true', 'Content-Type':'application/json', 'X-API-KEY':'API#Str1ngL4st1GKr4k3nPr0gr4m1n9Int3rF4c3sR1ght'})
};

export default new axios.Axios(config);