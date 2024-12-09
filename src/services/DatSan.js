import axios from 'axios'
import { API_URL_PREFIX } from '../utils/constant'

export const DatSan = (khachHangId, tongTien, sanId, chitietDonDats) => {
    const datSanRequest = {
        khachHangId: khachHangId,
        tongTien: tongTien,
        sanId: sanId,
        chitietDonDats: chitietDonDats
    }
    console.log("Đặt sân request: ", datSanRequest)
    return axios.post(API_URL_PREFIX + "/api/v1/dat-san/dat-coc", datSanRequest)
}