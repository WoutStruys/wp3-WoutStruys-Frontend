import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'
import type IUser from '../models/IUser'

const url = `${import.meta.env.VITE_BACKEND_PROTOCOL}://${import.meta.env.VITE_BACKEND_DOMAIN}:${import.meta.env.VITE_BACKEND_PORT}`

export default {
  async GetAllUsers() {
    return axios.get(`${url}/user/users`)
      .then((response: AxiosResponse<IUser[]>) => response)
      .catch((error: AxiosError) => {
        return error
      })
  },
  async DeleteType(id: number) {
    return axios.delete(`${url}/types/${id}`)
      .then((response: AxiosResponse<IType[]>) => response)
      .catch((error: AxiosError) => {
        return error
      })
  },

  async CreateType(name: string, duration: number) {
    return axios.post(`${url}/types/`, {
      name,
      duration,
    }).then((response: AxiosResponse) => {
      return response
    }).catch((error: AxiosError) => {
      return error
    })
  },

  async UpdateType(id: number, name: string, duration: number) {
    return axios.put(`${url}/types/${id}`, {
      name,
      duration,
    }).then((response: AxiosResponse) => {
      return response
    }).catch((error: AxiosError) => {
      return error
    })
  },

  async GetById(id: number) {
    return axios.get(`${url}/types/${id}`)
      .then((response: AxiosResponse<IType>) => response)
      .catch((error: AxiosError) => {
        return error
      })
  },
}
