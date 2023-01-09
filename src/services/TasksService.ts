import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'
import type ITasks from '../models/ITask'

const url = `${import.meta.env.VITE_BACKEND_PROTOCOL}://${import.meta.env.VITE_BACKEND_DOMAIN}:${import.meta.env.VITE_BACKEND_PORT}`

export default {
  async GetAllUnassignedTasks() {
    return axios.get(`${url}/task`)
      .then((response: AxiosResponse<ITasks[]>) => response)
      .catch((error: AxiosError) => {
        return error
      })
  },
  async GetAllUserTasks(id: string) {
    return axios.get(`${url}/task/${id}`)
      .then((response: AxiosResponse<ITasks[]>) => response)
      .catch((error: AxiosError) => {
        return error
      })
  },

  async AssignTaskToUser(id: number, userId: number) {
    return axios.patch(`${url}/task/${id}`, {
      userId,
    }).then((response: AxiosResponse) => {
      return response
    }).catch((error: AxiosError) => {
      return error
    })
  },

  async SetTaskAsDone(id: number, userId: string) {
    return axios.put(`${url}/task/${id}`, {
      userId,
      completed: true,
    }).then((response: AxiosResponse) => {
      return response
    }).catch((error: AxiosError) => {
      return error
    })
  }
}
