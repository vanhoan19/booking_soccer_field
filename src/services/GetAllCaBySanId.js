import axios from 'axios'
import { API_URL_PREFIX } from '../utils/constant'

export const GetAllCaBySanId = (sanId) => {
    return axios.post(API_URL_PREFIX + `/api/v1/dat-san/get-all-ca/${sanId}`)
}