import axios from 'axios'
import { API_URL_PREFIX } from '../utils/constant'

export const GetAllParentSan = () => {
    return axios.post(API_URL_PREFIX + '/api/v1/san/get-sans')
}