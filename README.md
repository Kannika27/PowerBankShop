# 🔋 PowerBank Shop (แอปพลิเคชันร้านค้าพาวเวอร์แบงค์)

> **วิชา:** Internet Programming (การเขียนโปรแกรมบนอินเทอร์เน็ต)  
> **อาจารย์ผู้สอน:** อ.สมเสาวภาพ นิลดำ (Dr. Somsawut Nindam)  
> **คณะวิทยาการคอมพิวเตอร์และสารสนเทศ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา**  
> **รหัสนักศึกษา:** `std6730251000` (กรรณิการ์)

---

## 🌐 ลิงก์ระบบใช้งานจริง (Live Demo & Database)

* **🖥️ หน้าเว็บไซต์ / โมบายล์แอปพลิเคชัน:** [http://119.59.102.161:3074/](http://119.59.102.161:3074/)  
  *(แสดงผลในรูปแบบกรอบสมาร์ทโฟน iPhone 15 Pro อัตโนมัติเมื่อเปิดผ่านคอมพิวเตอร์)*
* **🗄️ ฐานข้อมูล MySQL (phpMyAdmin):** [http://119.59.102.161/nindamdb](http://119.59.102.161/nindamdb)  
  * **Database:** `it_std6730251000`
  * **Username:** `std6730251000`
  * **Password:** `nZ!4pQrt`
* **📡 ทดสอบสถานะ Backend API:** [http://119.59.102.161:3074/api](http://119.59.102.161:3074/api)

---

## 🔑 บัญชีสำหรับทดสอบระบบ (Test Accounts)

| บทบาท (Role) | บัญชีผู้ใช้ (Username) | รหัสผ่าน (Password) | สิทธิ์การใช้งาน |
| :--- | :--- | :--- | :--- |
| **🛡️ ผู้ดูแลระบบ (Admin)** | `admin` | `admin123` | เพิ่มสินค้า, แก้ไขสินค้า, ลบสินค้า, ปรับสถานะจัดส่ง |
| **👤 สมาชิกทั่วไป (User)** | `kannika` | `123456` | ค้นหา, กรองราคา, เลือกดูสินค้า, หยิบใส่ตะกร้า, สั่งซื้อสินค้า |

*(หรือสามารถกดปุ่ม **"สมัครสมาชิก"** เพื่อสร้างบัญชีใหม่เข้าสู่ฐานข้อมูล MySQL ได้โดยตรง)*

---

## 🛠️ เทคโนโลยีที่ใช้ในการพัฒนา (Tech Stack)

### 1. หน้าบ้าน (Frontend)
* **Framework:** React Native (Expo Router)
* **Responsive Layout:** 2-Column Grid สลับเป็นแบบเต็มจอได้ พร้อม iPhone 15 Pro Frame จำลองการแสดงผลบนคอมพิวเตอร์
* **Storage:** `@react-native-async-storage/async-storage` บันทึก JWT Token และสถานะของตะกร้าสินค้า

### 2. หลังบ้าน (Backend)
* **Runtime:** Node.js (Express.js Framework)
* **Database Driver:** `mysql2/promise` (เชื่อมต่อไปยัง MySQL Server มหาวิทยาลัย)
* **Security:** `bcryptjs` เข้ารหัสแฮชรหัสผ่าน (Salt 10 Rounds) ก่อนบันทึกลงฐานข้อมูล และ `jsonwebtoken` (JWT) สำหรับยืนยันสิทธิ์

---

## 📡 RESTful API Endpoints

| Method | Endpoint | รายละเอียด | สิทธิ์การเข้าถึง |
| :--- | :--- | :--- | :--- |
| `GET` | `/api` | ตรวจสอบสถานะการทำงานของ API | สาธารณะ |
| `POST` | `/api/auth/register` | สมัครสมาชิกใหม่ (บันทึกลง MySQL) | สาธารณะ |
| `POST` | `/api/auth/login` | เข้าสู่ระบบและรับ JWT Token | สาธารณะ |
| `GET` | `/api/products` | ดึงรายการสินค้าทั้งหมด | สาธารณะ |
| `POST` | `/api/products` | เพิ่มสินค้าใหม่เข้าสู่ระบบ | Admin |
| `PUT` | `/api/products/:id` | แก้ไขข้อมูลสินค้า | Admin |
| `DELETE` | `/api/products/:id` | ลบสินค้าออกจากระบบ | Admin |
