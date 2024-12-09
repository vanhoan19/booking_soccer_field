import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { GetDetailSanService } from "../services/GetDetailSanService"
import { Button, Col, Row, Spin, Table, message } from "antd"
import {formatCurrency} from "../utils/converter"
import {formatDateToDDMMYYYY, formatDateToYYYYMMDD} from '../utils/converter'
import { AuthContext } from "../cores/AuthProvider"
import {DatSan} from '../services/DatSan'
import { LoadingOutlined } from "@ant-design/icons"

export const DatLichComponent = () => {
    const colNames = ["Ngày", "Thời gian", "Tên sân", "Giá"]

    const [sanDetail, setSanDetail] = useState(null)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const {user} = useContext(AuthContext)
    const {sanId} = useParams()

    useEffect(() => {
        GetDetailSanService(sanId)
        .then(response => {
        if (response.data.code === 1000) {
            setSanDetail(response.data.data)
        }
        })
        .catch(err => {
            console.log("Get detail san failed: ", err)
        })
    }, [])

    const pickedSlots = JSON.parse(sessionStorage.getItem("pickedSlots"))
    
    const columns = colNames.map(colName => {
        return {
            title: colName,
            dataIndex: colName,
            key: colName,
        }
    })

    const source = pickedSlots?.map(pickedSlot => {
        return {
            [colNames[0]]: formatDateToDDMMYYYY(pickedSlot.ngayDat),
            [colNames[1]]: pickedSlot.khung,
            [colNames[2]]: pickedSlot.tenSan,
            [colNames[3]]: formatCurrency(pickedSlot.gia)
        }
    })

    const calcTongTien = () => {
        let tongTien = 0
        pickedSlots.forEach(pickedSlot => tongTien += pickedSlot.gia)
        return tongTien
    }

    const thanhToanClick = () => {
        setLoading(true)

        const chitietDonDats = pickedSlots.map(pickedSlot => {
            return {
                slotId: pickedSlot.slotId,
                ngayDat: pickedSlot.ngayDat
            }
        })
        DatSan(user.id, calcTongTien(), sanId, chitietDonDats)
        .then(response => {
            setLoading(false)
            if (response.data.code === 1000) {
                message.success("Bạn đã đặt sân thành công!")
                navigate("/ket-qua-dat-san", {replace: true})
            }
        })
        .catch(err => {
            setLoading(false)
            if (err.response && err.response.data.code !== 1000) {
                console.log("Thanh toán failed: ", err)
            }
        })
    }

    const dataSource = [
        ...source,
        {
            [colNames[0]]: null,
            [colNames[1]]: null,
            [colNames[2]]: "Tổng tiền:",
            [colNames[3]]: formatCurrency(calcTongTien())
        },
        {
            [colNames[0]]: null,
            [colNames[1]]: null,
            [colNames[2]]: "Đặt cọc:",
            [colNames[3]]: formatCurrency(calcTongTien() / 2)
        }
    ]


    return (
        <>
            <div>
                <h1 style={{textAlign: 'center'}}>Đặt lịch {sanDetail?.tenSan}</h1>
                <Row gutter={16} style={{margin: '0 50px'}}>
                    <Col span={12}>
                        <h2>Thông tin người đặt</h2>
                        <div style={{fontSize: '1.1rem' }}>Họ tên: {user.hoTen}</div>
                        <div style={{fontSize: '1.1rem', margin: '10px 0' }}>Liên hệ: {user.soDienThoai}</div>
                    </Col>
                    <Col span={10}>
                        <h2>Thông tin sân bóng</h2>
                        <div style={{fontSize: '1.1rem' }}>Địa chỉ: {sanDetail?.diaChi}</div>
                        <div style={{fontSize: '1.1rem', margin: '10px 0' }}>Liên hệ: {sanDetail?.soDienThoai}</div>
                    </Col>
                </Row>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')} // Thêm style cho hàng
                    bordered
                    sticky={true}
                    pagination={false}
                    style={{margin: '0 50px 10px'}}
                />

                <Button size="large" type="primary" style={{float: 'right', margin: '10px 50px'}} onClick={thanhToanClick}>Thanh toán</Button>
            </div>
            <Spin spinning={loading} indicator={<LoadingOutlined spin />} fullscreen />
        </>
    )
}