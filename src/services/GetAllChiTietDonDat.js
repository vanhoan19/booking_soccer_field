import axios from 'axios'
import { API_URL_PREFIX } from '../utils/constant'

export const GetAllChiTietDonDat = (sanId, startDate, endDate) => {
    const formData = new FormData()
    formData.append('sanId', sanId)
    formData.append('startDate', startDate)
    formData.append('endDate', endDate)
    return axios.post(API_URL_PREFIX + "/api/v1/dat-san/get-all-chi-tiet-dondat", formData)
}