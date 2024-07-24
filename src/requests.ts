import axios from "@/src/axios";
import { type AxiosResponse } from "axios";

const HOSTNAME = "http://localhost:80/api";

export function get(path: string): Promise<AxiosResponse<any>> {
    return axios.get(`${HOSTNAME}${path}`);
}

export function post(path: string, body: any): Promise<AxiosResponse<any>> {
    return axios.post(`${HOSTNAME}${path}`, JSON.stringify(body));
}

export function put(path: string, body: any): Promise<AxiosResponse<any>> {
    return axios.put(`${HOSTNAME}${path}`, JSON.stringify(body));
}

export function del(path: string): Promise<AxiosResponse<any>> {
    return axios.delete(`${HOSTNAME}${path}`);
}