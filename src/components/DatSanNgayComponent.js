import { Button, Flex, Table, Skeleton } from "antd";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GetAllCaBySanId } from '../services/GetAllCaBySanId';
import { GetAllChildSan } from '../services/GetAllChildSan';
import { GetAllSlotBySanId } from '../services/GetAllSlotBySanId';
import { GetAllChiTietDonDat } from '../services/GetAllChiTietDonDat';
import { formatCurrency, parseCurrency, compareDateTimeWithNow } from "../utils/converter";
import {HeaderComponent} from './HeaderComponent'
import { AuthContext } from "../cores/AuthProvider";

export const DatSanNgayComponent = () => {
    const colKhungName = "Khung"
    const colSanName = "Sân"
    const colDaysName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const {sanId} = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const {isAuthenticated, user} = useContext(AuthContext)
    
    // Lấy ngày đầu tuần hiện tại (Thứ 2) và ngày cuối tuần (Chủ nhật)
    const [currentWeekStart, setCurrentWeekStart] = useState(dayjs().startOf('week').add(1, 'day')); // Thứ 2
    const [listCa, setListCa] = useState([]) // lưu các ca trong ngày của san
    const [childSans, setChildSans] = useState([]) // lưu các sân con của sân đó
    const [slots, setSlots] = useState([]) // lưu tất cả các slot trong tuần của sân đó
    const [bookedSlots, setBookedSlots] = useState([]) // lưu các slot đã đặt trong tuần
    const [slotsMap, setSlotsMap] = useState(new Map()) // dễ dàng lấy slot qua sanId, caId, dayOfWeek
    const [dataSource, setDataSource] = useState([]);
    const [pickedSlots, setPickedSlots] = useState([]);

    const otherColumns = Array.from({ length: 7 }).map((_, index) => {
        const day = currentWeekStart.clone().add(index, 'day')
        return {
          title: `${day.format('ddd')} ${day.format('DD/MM')}`,
          dataIndex: colDaysName[index],
          key: colDaysName[index],
          render: (text, record) => {
            return record[colDaysName[index]]?.gia;
          },
        }
      });
    
      // Cấu hình cột cho bảng
      const columns = [
        {
          title: colKhungName,
          dataIndex: colKhungName,
          key: colKhungName,
          onCell: (record, rowIndex) => ({
            rowSpan: rowIndex % childSans.length === 0 ? childSans.length : 0
          }),
        },
        {
          title: colSanName,
          dataIndex: colSanName,
          key: colSanName
        },
        ...otherColumns
      ];

      useEffect(() => {
        if (currentWeekStart && possibleWeek(dayjs(), currentWeekStart)) {
            const startDate = currentWeekStart.format('YYYY-MM-DD');
            const endDate = currentWeekStart.clone().add(6, 'day').format('YYYY-MM-DD');
            GetAllChiTietDonDat(sanId, startDate, endDate)
            .then(response => {
                if (response.data.code === 1000) {
                    console.log("danh sách các slot đã đặt: ", response.data.data)
                    setBookedSlots(response.data.data)
                }
            })
        }
        else {
            setDataSource([])
        }
    }, [currentWeekStart])

      useEffect(() => {
        if (listCa.length > 0 && childSans.length > 0) {
            const newDataSource = listCa.flatMap(ca => {
                return childSans.map(childSan => {
                    const tmpRow = {
                        [colKhungName]: `${ca.gioBatDau.slice(0, 5)} - ${ca.gioKetThuc.slice(0, 5)}`,
                        [colSanName]: `${childSan.tenSan}`
                    };
    
                    Array.from({ length: 7 }).forEach((_, index) => {
                        const dayOfWeek = colDaysName[index];
                        const day = currentWeekStart.clone().add(index, 'day').format('YYYY-MM-DD')
                        const caId = ca.id;
                        const childSanId = childSan.id;
    
                        const slotKey = `${childSanId}_${caId}_${dayOfWeek}`;
                        const slot = slotsMap.get(slotKey);
    
                        const trangThai = slot
                            ? bookedSlots.some(
                                  bookedSlot =>
                                      bookedSlot.slotId === slot.id &&
                                      bookedSlot.ngayDat === day
                              )
                            : false;
                        
                        const giaFormmated = formatCurrency(slot?.gia)
    
                        tmpRow[dayOfWeek] = {
                            gia: compareDateTimeWithNow(day, ca.gioBatDau) ? 
                                (!trangThai ? 
                                    <Button onClick={() => handleSlotClick(tmpRow, dayOfWeek, giaFormmated)}>     {giaFormmated}
                                    </Button> : 
                                <Button disabled>Đã đặt</Button>) : 
                                null,
                            ngayDat: currentWeekStart.clone().add(index, 'day').format('YYYY-MM-DD'),
                            trangThai: trangThai,
                            giaSlot: slot?.gia,
                            slotId: slot?.id
                        };
                    });
    
                    return tmpRow;
                });
            });
            setDataSource(newDataSource);
        }
    }, [listCa, childSans, slotsMap, bookedSlots]);

    const handleSlotClick = (record, dayOfWeek, giaFormmated) => {
        setDataSource(prevDataSource => {
            return prevDataSource.map(row => {
                if (
                    row[colKhungName] === record[colKhungName] &&
                    row[colSanName] === record[colSanName]
                ) {
                    const currentStatus = row[dayOfWeek].trangThai;
                    console.log("current status: ", currentStatus)

                    if (!currentStatus) setPickedSlots(prev => [...prev, {
                        ngayDat: record[dayOfWeek].ngayDat,
                        khung: record[colKhungName],
                        tenSan: record[colSanName],
                        gia: record[dayOfWeek].giaSlot,
                        slotId: record[dayOfWeek].slotId,
                    }])
                    else {
                        setPickedSlots(prev => 
                            prev.filter(pickedSlot => 
                                !(pickedSlot.slotId === record[dayOfWeek].slotId && pickedSlot.ngayDat === record[dayOfWeek].ngayDat)
                            )
                        )
                    }

                    // Đảo ngược trạng thái của ô được click
                    return {
                        ...row,
                        [dayOfWeek]: {
                            ...row[dayOfWeek],
                            gia: (
                                <Button
                                    onClick={() => handleSlotClick(row, dayOfWeek, giaFormmated)}
                                    style={{
                                        backgroundColor: !currentStatus ? '#3dff71' : '#fff'
                                    }}
                                >
                                    {giaFormmated}
                                </Button>
                            ),
                            trangThai: !currentStatus // Đảo trạng thái
                        }
                    };
                }
                return row;
            });
        });
    };    

    useEffect(() => {
        // lấy danh sách các ca trong ngày của sân
        GetAllCaBySanId(sanId)
        .then(response => {
            if (response.data.code === 1000) {
                console.log("danh sách các ca: ", response.data.data)
                setListCa(response.data.data)
            }
        })
        .catch(err => {
            console.log("Lỗi lấy danh sách các ca: ", err)
        })

        // lấy danh sách các sân con của sân
        GetAllChildSan(sanId)
        .then(response => {
            if (response.data.code === 1000) {
                console.log("danh sách các sân con: ", response.data.data)
                setChildSans(response.data.data)
            }
        })
        .catch(err => {
            console.log("Lỗi lấy danh sách các sân con: ", err)
        })

        // Lấy danh sách các slot trong tuần của sân
        GetAllSlotBySanId(sanId)
        .then(response => {
            if (response.data.code === 1000) {
                const data = response.data.data
                console.log("danh sách các slot: ", response.data.data)
                setSlots(data)
                const slotMap = new Map(data.map(slot => [`${slot.sanId}_${slot.caId}_${slot.dayOfWeek}`, slot]))
                console.log("SLot map: ", slotMap)
                setSlotsMap(slotMap)
            }
        })
        .catch(err => {
            console.log("Lỗi lấy danh sách các slot: ", err)
        })
    }, [])

    const getWeekRange = (startOfWeek) => {
        const startDate = startOfWeek.format('DD MMM');
        const endDate = startOfWeek.add(6, 'day').format('DD MMM YYYY');
        return ` ${startDate} - ${endDate} `;
    };

    const handleNextWeek = () => {
        setCurrentWeekStart((prev) => prev.add(7, 'day')); // Chuyển sang tuần tiếp theo
    };

    const handlePreviousWeek = () => {
        setCurrentWeekStart((prev) => prev.subtract(7, 'day')); // Chuyển sang tuần trước
    };  

    const onClickDatLichNgay = () => {
        if (pickedSlots.length > 0) {
            sessionStorage.setItem("pickedSlots", JSON.stringify(pickedSlots))
            sessionStorage.setItem("sanId", sanId)
            if (!isAuthenticated) {
                navigate("/login", { replace: true, state: { from: location } })
            }
            else {
                navigate(`/dat-san-ngay/${sanId}`)
            }
        }
    }

    const calcTongTien = () => {
        let tongTien = 0
        pickedSlots.forEach(pickedSlot => tongTien += pickedSlot?.gia || 0)
        return tongTien
    }

    const possibleWeek = (currentDate, comparisionDate) => {
        if (comparisionDate.clone().add(6, 'day').isBefore(currentDate) || 
            comparisionDate.diff(currentDate, 'day') > 30) 
            return false
        return true
    }

    return (
        <div style={{margin: '0 20px 10px'}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0 10px', justifyContent: 'center' }}>
                <Button onClick={handlePreviousWeek} style={{border: 'none'}}>◀️ </Button>
                <span style={{ fontSize: '18px', color: '#2482ee'}}>{getWeekRange(currentWeekStart)}</span>
                <Button onClick={handleNextWeek} style={{border: 'none'}}>▶️ </Button>
            </div>  

            {dataSource && console.log("Datasource: ", dataSource)}

            <Table
                dataSource={dataSource}
                columns={columns}
                rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')} // Thêm style cho hàng
                bordered
                sticky={true}
                locale={{ emptyText: null }}
                pagination={false}
                style={{maxHeight: '72vh',  overflow: 'auto'}}
            />

            {pickedSlots.length > 0 && (
                <Flex vertical={false} justify={'space-around'} align="center" style={{padding: '10px'}}>
                    <Flex vertical>
                        <span>Đã chọn: <b>{pickedSlots.length}</b> lịch</span>
                        <span>Tổng tiền: <b>{formatCurrency(calcTongTien())}</b></span>
                    </Flex>
                    <Button type="primary" size={'large'} onClick={() => onClickDatLichNgay()}>Đặt lịch ngay</Button>
                </Flex>
            )}

            {!dataSource.length && <div style={{backgroundColor: "blue", textAlign: 'center', padding: '20px', fontSize: '1rem'}}>Không có sân phù hợp để đặt</div>}
        </div>
    )
}