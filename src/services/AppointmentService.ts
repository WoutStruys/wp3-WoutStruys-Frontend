import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'
import type AppointmentModel from '../models/AppointmentModel'

const url = `${import.meta.env.VITE_BACKEND_PROTOCOL}://${import.meta.env.VITE_BACKEND_DOMAIN}:${import.meta.env.VITE_BACKEND_PORT}`

export default {
  async GetAllAppointments() {
    return axios.get(`${url}/appointment/getAll`)
      .then((response: AxiosResponse<AppointmentModel[]>) => {
        return response
      }).catch((error: AxiosError) => {
        console.error(error)
        return error
      })
  },
}
