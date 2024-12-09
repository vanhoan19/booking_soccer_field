import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
export const KetQuaDatSan = () => {
    const navigate = useNavigate()
    return (
    <Result
        status="success"
        title="Đặt sân thành công!"
        subTitle="Bạn đã đặt sân thành công, vui lòng chờ ít phút để sân liên hệ lại cho bạn! Trân trọng!"
        extra={[
        <Button type="primary" onClick={() => navigate("/")}>
            Về trang chủ
        </Button>
        ]}
    />
    )
}