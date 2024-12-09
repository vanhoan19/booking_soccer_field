import { Button, Card, Flex, Layout, List, Tooltip } from "antd"
import { HeaderComponent } from "./HeaderComponent";
import { Content } from "antd/es/layout/layout";
import {EnvironmentOutlined, PhoneOutlined} from '@ant-design/icons'
import { useEffect, useState } from "react";
import {GetAllParentSan} from '../services/GetAllParentSan'
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

export const MainComponent = () => {
    const [parentSans, setParentSans] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        GetAllParentSan()
        .then(response => {
            if (response.data.code === 1000) setParentSans(response.data.data)
        })
        .catch()
    }, [])

    const chiTietSanClick = (id) => {
        navigate(`/detail/${id}`)
    }

    return (
        <Content style={{padding: '10px 50px'}}>
            <h1 style={{textAlign: 'center'}}>Danh sách sân bóng</h1>
            <List
                grid={{
                    gutter: 16,
                    column: 4,
                }}
                dataSource={parentSans}
                renderItem={(item) => (
                <List.Item style={{marginBottom: '30px'}}>
                    <Card
                        hoverable
                        style={{
                            width: '90%',
                            margin: '0 auto',
                        }}
                        cover={<img alt={item.tenSan} src={item.hinhAnhMain} height={"200px"} />}
                    >
                        <Meta 
                            title={
                            <Tooltip title={item.tenSan}>
                                <div 
                                    style={{
                                        fontSize: '1.2rem', 
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',}}
                                    >
                                        {item.tenSan}
                                    </div>
                            </Tooltip>
                            } 
                            description={
                                <Flex vertical>
                                    <Flex vertical={false} style={{marginBottom: '5px'}}>
                                        <PhoneOutlined style={{marginRight: '10px'}} /> 
                                        {item.soDienThoai}
                                    </Flex>
                                    <Flex vertical={false} style={{marginBottom: '10px', alignItems: 'start'}}>
                                        <EnvironmentOutlined style={{marginRight: '10px', paddingTop: '5px'}} /> <div style={{
                                            display: '-webkit-box',    
                                            WebkitBoxOrient: 'vertical',       
                                            WebkitLineClamp: 2,           
                                            overflow: 'hidden',
                                            height: '45px'
                                        }}>
                                            {item.diaChi}
                                        </div>
                                    </Flex>
                                    <Button type="primary" onClick={() => chiTietSanClick(item.id)}>Chi tiết</Button>
                                </Flex>
                            } 
                        />
                    </Card>
                </List.Item>
                )}
            />
        </Content>
    )
}