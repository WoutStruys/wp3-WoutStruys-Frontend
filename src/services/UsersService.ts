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
}
