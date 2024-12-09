import axios from 'axios'
import { API_URL_PREFIX } from '../utils/constant'

export const GetAllSlotBySanId = (sanId) => {
    return axios.post(API_URL_PREFIX + `/api/v1/dat-san/get-all-slot/${sanId}`)
}