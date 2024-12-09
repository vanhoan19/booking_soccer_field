import {Flex, Button, Checkbox, Form, Input, message, Image} from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SignupService } from '../services/SignupService'
import {AuthContext} from '../cores/AuthProvider'
import { useContext, useEffect, useRef, useState } from 'react';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import {ThemSanService} from '../services/ThemSanService'

export const ThemSanComponent = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const fileInputRef = useRef(null)
    const hinhAnhDetailInputRef = useRef(null)
    const {login} = useContext(AuthContext)
    const [hinhAnhMain, setHinhAnhMain] = useState(null)
    const [hinhAnhDetail, setHinhAnhDetail] = useState([])

    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        return () => {
            if (hinhAnhMain !== null) {
                URL.revokeObjectURL(hinhAnhMain.url)
            }
        }
    }, [hinhAnhMain])

    const onFinish = (values) => {
        const tenSan = values.tenSan
        const diaChi = values.diaChi
        const soDienThoai = values.soDienThoai
        const description = values.description
        
        ThemSanService(tenSan, diaChi, soDienThoai, description, hinhAnhMain?.file, hinhAnhDetail)
        .then(response => {
            if (response.data.code === 1000) {
                message.success("Thêm mới sân thành công")
                setTimeout(() => {
                    navigate(0)
                }, 1500);
            }
        })
        .catch(err => {
            if (err.response && err.response.data.code !== 1000) {
                message.info(err.response.data.message)
            }
            else {
                console.log("Tạo sân lỗi: ", err)
            }
        })
      };
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

      const handleRemoveImage = (fileUrl) => {
        // Trước khi xóa ảnh, revoking URL để giải phóng bộ nhớ
        const fileToRemove = hinhAnhDetail.find(file => file.url === fileUrl);
        if (fileToRemove && fileToRemove.url) {
            URL.revokeObjectURL(fileToRemove.url);
        }
    
        // Cập nhật trạng thái để xóa tệp ra khỏi danh sách
        setHinhAnhDetail((prevFiles) => prevFiles.filter((file) => file.url !== fileUrl));
    };

    const handleIconClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
    };

    const handleUploadHinhAnhDetailClick = () => {
        if (hinhAnhDetailInputRef.current) {
            hinhAnhDetailInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setHinhAnhMain({
                url: URL.createObjectURL(file),
                file,
            })
        }
    }

    const handleListFileChange = (event) => {
        setHinhAnhDetail(prev => {
            return [
                ...prev,
                ...Array.from(event.target.files).map(file => {
                    return {
                        url: URL.createObjectURL(file),
                        file,
                    }
                })
            ]
        })
    }

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
                <h1 style={{textAlign:'center'}}>Thêm sân mới</h1>
                <Form.Item
                    label="Tên sân"
                    name="tenSan"
                    labelAlign={'left'}
                    rules={[
                        {
                        required: true,
                        message: 'Nhập tên sân ...',
                        },
                    ]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                    label="Địa chỉ"
                    name="diaChi"
                    labelAlign={'left'}
                    rules={[
                        {
                        required: true,
                        message: 'Vui lòng nhập địa chỉ...',
                        },
                    ]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Số điện thoại"
                name="soDienThoai"
                labelAlign={'left'}
                rules={[
                    {
                    required: true,
                    message: 'Vui lòng số điện thoại...',
                    },
                ]}
                >
                <Input maxLength={11} />
                </Form.Item>

                <Form.Item
                label="Mô tả"
                name="description"
                labelAlign={'left'}
                >
                <Input />
                </Form.Item>

                <Form.Item 
                    label="Hình ảnh main" 
                    labelAlign='left' 
                    style={{marginBottom: '10px', height: 'fit-content'}}
                    name="hinhAnhMain"
                    rules={[
                        {
                          required: true,
                          message: 'Vui lòng chọn hình ảnh sân!',
                          validator: (_, value) => {
                            if (!hinhAnhMain) {
                                return Promise.reject('Vui lòng chọn hình ảnh chính!');
                              }
                              return Promise.resolve();
                          }
                        },
                      ]}
                >
                    <Flex vertical={false} gap={'small'}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        {hinhAnhMain && 
                            <Image height={'80px'} src={hinhAnhMain.url} alt='Hình ảnh chính' width={'80px'} style={{borderRadius: '10px', objectFit: 'cover'}} preview={false} >
                            </Image>
                        }
                        
                        <button
                            style={{
                                background: 'none',
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                border: '1px #1677ff solid'
                            }}
                            type="button"
                            onClick={handleIconClick}
                            >
                            <PlusOutlined />
                            <div
                                style={{
                                marginTop: 8,
                                }}
                            >
                                Tải ảnh
                            </div>
                        </button>
                    </Flex>
                </Form.Item>

                <Form.Item 
                    label="Hình ảnh chi tiết" 
                    labelAlign='left' 
                    style={{marginBottom: '10px', height: '80px'}}
                >
                    <Flex vertical={false} style={{overflow: 'auto'}}>
                        <input
                            ref={hinhAnhDetailInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleListFileChange}
                        />
                        {hinhAnhDetail.map((file, index) => (
                            <div key={`attachment_${index}`} style={{ position: 'relative', display: 'flex' }}>
                            <Image height={'80px'} src={file.url} alt={'Hinh ảnh detail'} width={'80px'} style={{borderRadius: '10px', objectFit: 'cover', padding: '5px'}} preview={false} >
                            </Image>
                            <CloseOutlined
                                onClick={() => handleRemoveImage(file.url)}
                                style={{
                                position: 'absolute',
                                top: '-2px',
                                right: '-2px',
                                color: 'white',
                                backgroundColor: 'red',
                                borderRadius: '50%',
                                padding: '2px',
                                cursor: 'pointer',
                                fontSize: '10px',
                                }}
                            />
                            </div>
                        ))}
                        <button
                            style={{
                                background: 'none',
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                border: '1px #1677ff solid'
                            }}
                            type="button"
                            onClick={handleUploadHinhAnhDetailClick}
                            >
                            <PlusOutlined />
                            <div
                                style={{
                                marginTop: 8,
                                }}
                            >
                                Tải ảnh
                            </div>
                        </button>
                        
                    </Flex>
                </Form.Item>

                <Form.Item 
                    label={null}  
                    style={{padding: '10px'}}
                >
                    <Button type="primary" htmlType="submit" size='large' style={{display: 'inline-flex'}}>
                        Tạo sân
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    )
}