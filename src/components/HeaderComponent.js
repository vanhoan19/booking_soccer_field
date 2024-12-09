import { Avatar, Button, Dropdown, Flex, Image } from "antd"
import { Header } from "antd/es/layout/layout"
import { useContext } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../cores/AuthProvider"
import { UserOutlined } from "@ant-design/icons"
export const HeaderComponent = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const {isAuthenticated, user, logout} = useContext(AuthContext)

    const items = [
        {
            key: 'logout',
            label: (
                <Button onClick={() => logout()}>Log out</Button>
            )
        },
        // {
        //     key: 'Lịch sử đặt sân',
        //     label: (
        //         <Button onClick={() => logout()}>Lịch sử đặt sân</Button>
        //     )
        // },
    ]

    const handleGoHome = () => {
        if (location.pathname !== "/") {
            navigate("/")
        }
    }

    const signupClick = () => {
        navigate("/signup", { replace: true, state: { from: location } })
    }

    const loginClick = () => {
        navigate("/login", { replace: true, state: { from: location } })
    }

    const styleButton = {
        lineHeight: '100%', 
        padding: '20px 10px', 
        backgroundColor: 'transparent', 
        color: 'white', 
        marginRight: '10px',
        border: 'none'
    }

    return (
        <Header style={{padding: '10px 50px', height: '50px', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Image src="https://datsan247.com/images/logo.png" preview={false} style={{height: '40px', cursor: 'pointer'}} onClick={handleGoHome} />
            {!isAuthenticated ? 
                <Flex vertical={false} style={{flexGrow: 1}} justify="end" >
                    <Button style={styleButton} onClick={signupClick}> Đăng ký</Button>
                    <Button style={styleButton} onClick={loginClick}> Đăng nhập</Button> 
                </Flex> :
                <Flex vertical={false} justify={'space-between'} style={{flexGrow: 1, marginLeft: '10px'}}>
                    {user.loaiTaiKhoan === 'CHUSAN' ? <Link to={"/tao-san"} style={{color: "#fff", fontSize: '1rem'}}>Tạo sân</Link> : <div></div>}
                    <Flex vertical={false}>
                        <Dropdown 
                                menu = {{items}}
                                placement='bottomLeft'
                            >
                                <div style={{color: 'white', cursor: 'pointer'}}>
                                    <UserOutlined size={16} style={{marginRight: '5px'}} />
                                    {user?.hoTen}
                                </div>
                        </Dropdown>
                    </Flex>
                </Flex>
            }
        </Header>
    )
}