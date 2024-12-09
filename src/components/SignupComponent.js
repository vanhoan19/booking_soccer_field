import {Flex, Button, Checkbox, Form, Input, message} from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SignupService } from '../services/SignupService'
import {AuthContext} from '../cores/AuthProvider'
import { useContext } from 'react';

export const SignUpComponent = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const {login} = useContext(AuthContext)

    const from = location.state?.from?.pathname || "/";

    const onFinish = (values) => {
        const soDienThoai = values.soDienThoai
        const matKhau = values.matKhau
        const hoTen = values.hoTen

        console.log("số điện thoại: ", soDienThoai)
        console.log("mật khẩu: ", matKhau)
        console.log("họ tên: ", hoTen)
        
        SignupService(soDienThoai, matKhau, hoTen)
        .then(response => {
            if (response.data.code === 1000) {
                message.success("Đăng ký thành công")
                login(response.data.data)
                navigate(from, {replace: true})
            }
        })
        .catch(err => {
            if (err.response && err.response.data.code !== 1000) {
                message.info(err.response.data.message)
            }
        })
      };
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
    return (
        <Flex 
            style={{
                height: '100vh',
                backgroundImage: 'url("https://image.dienthoaivui.com.vn/x,webp,q90/https://dashboard.dienthoaivui.com.vn/uploads/dashboard/editor_upload/hinh-nen-bong-da-14.jpg")',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            justify={'center'}
            align={'center'}
        >
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    width: '30vw',
                    minWidth: 250,
                    backgroundColor: '#b0f9ff',
                    padding: '0 20px 10px',
                    borderRadius: '3%',
                    boxShadow: '2px 2px 5px #1677ff'
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <h1 style={{textAlign:'center'}}>Đăng ký</h1>
                <Form.Item
                label="Số điện thoại"
                name="soDienThoai"
                labelAlign={'left'}
                rules={[
                    {
                    required: true,
                    message: 'Nhập số điện thoại...',
                    },
                ]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Mật khẩu"
                name="matKhau"
                labelAlign={'left'}
                rules={[
                    {
                    required: true,
                    message: 'Nhập mật khẩu...',
                    },
                ]}
                >
                <Input.Password />
                </Form.Item>

                <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                labelAlign={'left'}
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng xác nhận mật khẩu!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                        if (!value || getFieldValue('matKhau') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('Nhập lại mật khẩu không chính xác!'));
                        },
                    }),
                ]}
                >
                <Input.Password 
                    placeholder='Nhập lại mật khẩu ...'
                />
                </Form.Item>

                <Form.Item
                    label="Họ tên"
                    name="hoTen"
                    labelAlign={'left'}
                    rules={[
                        {
                        required: true,
                        message: 'Nhập họ tên...',
                        },
                    ]}
                >
                <Input />
                </Form.Item>

                <Form.Item 
                    label={null}  
                >
                    <Flex vertical={false} align={'center'} justify={'space-between'}>
                        <Button type="primary" htmlType="submit" style={{display: 'inline-flex'}}>
                            Đăng ký
                        </Button>
                        <Link to={'/signup'} style={{textDecoration: 'underline'}}>Đăng nhập</Link>
                    </Flex>
                </Form.Item>
            </Form>
        </Flex>
    )
}