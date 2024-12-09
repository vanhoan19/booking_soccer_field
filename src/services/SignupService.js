import axios from "axios"
import { API_URL_PREFIX } from "../utils/constant"

export const SignupService = (soDienThoai, matKhau, hoTen) => {
    const signUpRequest = new FormData()
    signUpRequest.append('soDienThoai', soDienThoai)
    signUpRequest.append('matKhau', matKhau)
    signUpRequest.append('hoTen', hoTen)
    return axios.post(API_URL_PREFIX + "/api/v1/taikhoan/dang-ky", signUpRequest)
}