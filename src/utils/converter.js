export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(amount).replace('₫', 'đ'); // Đổi ký tự ₫ thành đ
};

export const parseCurrency = (formattedString) => {
    if (!formattedString) return 0;

    // Loại bỏ ký tự '.' và 'đ', sau đó chuyển thành số
    const numericString = formattedString.replace(/\./g, '').replace('đ', '').trim();
    return parseInt(numericString, 10);
};

export const compareDateTimeWithNow = (ngay, gio) => {
    // Chuyển đổi chuỗi ngày giờ thành đối tượng Date
    const dateTimeString = `${ngay}T${gio}`; // "2024-12-05T17:00:05"
    const inputDate = new Date(dateTimeString);

    // Lấy thời điểm hiện tại
    const currentDate = new Date();

    // So sánh
    return inputDate > currentDate
};

export function formatDateToDDMMYYYY(dateString) {
    const [year, month, day] = dateString.split('-'); // Tách chuỗi thành các phần
    return `${day}-${month}-${year}`; // Trả về chuỗi theo định dạng "DD-MM-YYYY"
  }

export function formatDateToYYYYMMDD(dateString) {
    const [day, month, year] = dateString.split('-'); // Tách chuỗi thành các phần
    return `${year}-${month}-${day}`; // Trả về chuỗi theo định dạng "YYYY-MM-DD"
  }