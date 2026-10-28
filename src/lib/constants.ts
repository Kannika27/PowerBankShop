// กำหนด URL ของ Backend API
// ถ้าทดสอบในเครื่อง ให้ใช้ IP เครื่องของคุณ หรือ localhost (สำหรับ Web)
// ถ้า Deploy บนเซิร์ฟเวอร์มหาวิทยาลัย ให้ใส่พอร์ตที่ได้รับ เช่น http://119.59.102.161:3000/api
export const API_BASE_URL = 
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://119.59.102.161:3074/api';

// ลิงก์ raw JSON บน GitHub สำหรับดึงข้อมูลและรูปภาพ PowerBank ของคุณ
export const GITHUB_JSON_URL = 
  'https://raw.githubusercontent.com/Kannika27/PowerBankShop/refs/heads/main/products.json';
