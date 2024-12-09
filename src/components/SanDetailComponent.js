import { Button, Col, Grid, Image, Layout, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderComponent } from "./HeaderComponent";
import { Content } from "antd/es/layout/layout";
import { CalendarOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import {GetDetailSanService} from '../services/GetDetailSanService'

import './SanDetail.css'

export const SanDetailComponent = () => {
    const {sanId} = useParams()
    const navigate = useNavigate()
    const [images, setImages] = useState([])
    const [info, setInfo] = useState(null)

  useEffect(() => {
    GetDetailSanService(sanId)
    .then(response => {
      if (response.data.code === 1000) {
        setInfo(response.data.data)
      }
    })
    .catch(err => {
      if (err.response && err.response.data.code !== 1000) navigate("/")
    })
  }, [])

  useEffect(() => {
    if (info) {
      setImages(info.hinhAnhDetail ? info.hinhAnhDetail.split("|") : [])
    }
  }, [info])

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handlePrevious = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const datSanNgayClick = () => {
    navigate(`/dat-san/${sanId}`)
  }

  return (
      <Row gutter={16} style={{padding: '0 50px 10px'}}>
        <Col span={24}>
          <h1>{info?.tenSan}</h1>
        </Col>
        <Col span={14} style={{ width: "fit-content", margin: "auto", textAlign: "center", paddingRight: '1.5rem' }}>
          {/* Ảnh lớn với vùng bọc */}
          <div className="imageContainer">
            <img
              src={images ? images[activeImageIndex] : "#"}
              alt={info?.tenSan}
              width={'100%'}
              height={'100%'}
              // preview={false}
              style={{ borderRadius: "8px", objectFit: "cover", position: 'absolute',
                top: '0',
                left: '0'}}
            />

            {/* Nút Lùi */}
            <button
              onClick={handlePrevious}
              style={{left: '10px'}}
              className="navButton"
            >
              <LeftOutlined />
            </button>

            {/* Nút Tiến */}
            <button
              onClick={handleNext}
              style={{right: '10px'}}
              className="navButton"
            >
              <RightOutlined />
            </button>
          </div>

          {/* Danh sách thumbnail */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginTop: "20px",
              overflow: 'auto'
            }}
          >
            {images && images.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={info?.tenSan}
                preview={false}
                onClick={() => setActiveImageIndex(index)}
                style={{
                  cursor: "pointer",
                  border:
                    activeImageIndex === index
                      ? "2px solid #1890ff"
                      : "2px solid #ccc",
                  borderRadius: "4px",
                  transition: "border 0.3s",
                  height: "100px",
                  width: 'auto'
                }}
              />
            ))}
          </div>
        </Col>
        <Col span={10} style={{height: 'fit-content', padding: '10px 20px 15px', backgroundColor: '#fff', borderRadius: '10px'}}>
            <h2 style={{margin: '0', textTransform: 'uppercase'}}>Giới thiệu chung</h2>
            <p style={{fontSize: '1.1rem'}}>
            {info?.description}
            </p>
            <p style={{fontSize: '1.1rem'}}>Liên hệ: <span>{info?.soDienThoai}</span></p>
            <p style={{fontSize: '1.1rem'}}>Địa chỉ: <span>{info?.diaChi}</span></p>
            <Button size="large" type={'primary'} style={{marginBottom: '10px'}} onClick={() => datSanNgayClick()}>
              <CalendarOutlined />Đặt sân ngay
            </Button>
        </Col>
      </Row>
  );
};
