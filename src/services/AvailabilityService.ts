import type { AxiosError, AxiosResponse } from "axios"
import axios from "axios"
import type IAvailableDates from "../models/IAvailableDates"

const url = `${import.meta.env.VITE_BACKEND_PROTOCOL}://${
    import.meta.env.VITE_BACKEND_DOMAIN
}:${import.meta.env.VITE_BACKEND_PORT}`;

export default {
    async GetAvailableDates() {
        return axios
            .get(`${url}/available/dates`)
            .then((response: AxiosResponse<IAvailableDates[]>) => response)
            .catch((error: AxiosError) => {
                return error;
            });
    },
    async CreateAvailableDate(dates: any) {
        return axios
            .post(`${url}/available/dates`, {
                dates,
            })
            .then((response: AxiosResponse) => {
                return response;
            })
            .catch((error: AxiosError) => {
                return error;
            });
    },
    async GetAvailableHours() {
        return axios
            .get(`${url}/available/hours`)
            .then((response: AxiosResponse<IAvailableDates[]>) => response)
            .catch((error: AxiosError) => {
                return error;
            });
    },
    async CreateAvailableHour(day: string, startAt: string, stopAt: string) {
        return axios
            .post(`${url}/available/hours`, {
                day,
                startAt,
                stopAt,
            })
            .then((response: AxiosResponse) => {
                return response;
            })
            .catch((error: AxiosError) => {
                return error;
            });
    },
    async DeleteAvailableHour(id: number) {
        return axios
            .delete(`${url}/available/hours/${id}`)
            .then((response: AxiosResponse<IAvailableDates[]>) => response)
            .catch((error: AxiosError) => {
                return error;
            });
    },
    async UpdateAvailableHour(id: number, startAt: string, stopAt: string) {
        return axios
            .put(`${url}/available/hours/${id}`, {
                startAt,
                stopAt,
            })
            .then((response: AxiosResponse) => {
                return response;
            })
            .catch((error: AxiosError) => {
                return error;
            });
    },
};
