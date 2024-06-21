import axios, { AxiosHeaders, type AxiosRequestConfig } from "axios";

export function setToken(token: string)
{
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
}

const config: AxiosRequestConfig = {
    headers: new AxiosHeaders(),
};

export default new axios.Axios(config);