import axios from "axios"
import { API_URL_PREFIX } from "../utils/constant"

export const ThemSanService = (tenSan, diaChi, soDienThoai, description, hinhAnhMain, hinhAnhDetail) => {
    const formData = new FormData()

    formData.append('tenSan', tenSan)
    formData.append('diaChi', diaChi)
    formData.append('soDienThoai', soDienThoai)
    formData.append('description', description)
    formData.append('hinhAnhMain', hinhAnhMain)

    // Duyệt qua mảng files và thêm từng file vào FormData
    hinhAnhDetail.forEach((fileObj, index) => {
        formData.append(`hinhAnhDetails`, fileObj.file);
    });

    formData.forEach((value, key) => {
        console.log(key, value)
    })

    return axios.post(API_URL_PREFIX + '/api/v1/san/tao-san', formData)
}