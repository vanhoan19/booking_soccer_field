import axios from 'axios'
import { API_URL_PREFIX } from '../utils/constant'

export const GetDetailSanService = (sanId) => {
    return axios.post(API_URL_PREFIX + `/api/v1/san/detail/${sanId}`)
}