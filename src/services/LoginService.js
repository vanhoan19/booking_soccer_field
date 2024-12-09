import axios from 'axios'
import { API_URL_PREFIX } from '../utils/constant'

export const LoginService = (soDienThoai, matKhau) => {
    const loginRequest = new FormData()
    loginRequest.append('soDienThoai', soDienThoai)
    loginRequest.append('matKhau', matKhau)
    return axios.post(API_URL_PREFIX + '/api/v1/taikhoan/dang-nhap', loginRequest)
}