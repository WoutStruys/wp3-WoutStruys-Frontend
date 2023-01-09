import axios, { AxiosError, AxiosResponse } from 'axios'
import ErrorModel from '../models/ErrorModel';
import LoginResponseModel from '../models/LoginResponseModel';
import UserInfoModel from '../models/UserInfoModel';
axios.defaults.withCredentials = true

const url = `${import.meta.env.VITE_BACKEND_PROTOCOL}://${import.meta.env.VITE_BACKEND_DOMAIN}:${import.meta.env.VITE_BACKEND_PORT}`;

export default {
  async DoLogin(username: string, password: string) {
    return await axios.post(`${url}/user/login`, {
        username,
        password
    }, { withCredentials: true } ) 
    .then((response: AxiosResponse<LoginResponseModel>) => {
      // save response in session storage
      console.log(response.data.user._id)
      sessionStorage.setItem('username', response.data.user.username)
      sessionStorage.setItem('userid', response.data.user._id)
      sessionStorage.setItem('role', response.data.user.roles[0])
      
      return response
    }).catch((error: AxiosError<ErrorModel>) => {
      console.error(error)
      return error
    })
  },
  async DoLogout() {
    return await axios.post(`${url}/user/logout`, {
        withCredentials: true
    }).then((response: AxiosResponse) => {
        return response
    }).catch((error: AxiosError<ErrorModel>) => {
        console.error(error)
        return error
    })
  },
  async GetUserInfo() {
    return axios.post(`${url}/user/login/check`, {
        withCredentials: true
    }).then((response: AxiosResponse<UserInfoModel>) => {
        return response
    }).catch((error: AxiosError<ErrorModel>) => {
        console.error(error)
        return error
    })
  }
  
}