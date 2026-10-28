const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'powerbank_secret_key_6730251000';

app.use(cors());
app.use(express.json());

let localMockUsers = [
  { user_id: 1, username: 'admin', password: bcrypt.hashSync('admin123', 10), email: 'admin@powerbank.com', role: 'admin' }
];

// ฟังก์ชันสร้าง Connection เชื่อมต่อ MySQL
async function getDbConnection() {
  try {
    return await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'std6730251000',
      password: process.env.DB_PASSWORD || 'nZ!4pQrt',
      database: process.env.DB_NAME || 'it_std6730251000',
      port: Number(process.env.DB_PORT || 3306),
      connectTimeout: 2000
    });
  } catch (e) {
    return null;
  }
}

// ค้นหาโฟลเดอร์ dist (รองรับทั้งบน Server และเครื่องคอม)
const path = require('path');
const fs = require('fs');
const distPath = fs.existsSync(path.join(__dirname, 'dist'))
  ? path.join(__dirname, 'dist')
  : path.join(__dirname, '../dist');

if (fs.existsSync(distPath)) {
  app.use('/std6730251000/app', express.static(distPath));
  app.use(express.static(distPath));
}

// เช็คสถานะ API (ตามสไลด์)
app.get('/api', (req, res) => {
  res.send('API is running');
});

// ==========================================
// 1. ระบบสมัครสมาชิก (Sign Up บันทึก User ลง DB)
// ==========================================
app.post('/api/auth/register', async (req, res) => {
  let connection;
  try {
    const { username, password, email } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'กรุณากรอก Username และ Password' });
    }

    connection = await getDbConnection();

    if (!connection) {
      const exist = localMockUsers.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
      if (exist) return res.status(409).json({ error: 'Username นี้ถูกใช้งานแล้ว' });
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        user_id: localMockUsers.length + 1,
        username: username.trim(),
        password: hashedPassword,
        email: email || null,
        role: 'user'
      };
      localMockUsers.push(newUser);
      const token = jwt.sign(
        { sub: newUser.user_id, username: newUser.username, role: 'user' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.status(201).json({
        message: 'สมัครสมาชิกสำเร็จ',
        token,
        user: { user_id: newUser.user_id, username: newUser.username, email: newUser.email, role: 'user' }
      });
    }

    // ตรวจสอบว่ามี username นี้หรือยัง
    const [exist] = await connection.execute(
      'SELECT user_id FROM user WHERE username = ? LIMIT 1',
      [username.trim()]
    );
    if (exist.length > 0) {
      return res.status(409).json({ error: 'Username นี้ถูกใช้งานแล้ว' });
    }

    // แฮชรหัสผ่านด้วย bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // บันทึก id user และข้อมูลลง MySQL
    const [result] = await connection.execute(
      'INSERT INTO user (username, password, email, role) VALUES (?, ?, ?, ?)',
      [username.trim(), hashedPassword, email || null, 'user']
    );

    const newUser = {
      user_id: result.insertId,
      username: username.trim(),
      email: email || null,
      role: 'user'
    };

    const token = jwt.sign(
      { sub: newUser.user_id, username: newUser.username, role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'สมัครสมาชิกสำเร็จ',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'ไม่สามารถสมัครสมาชิกได้: ' + error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// ==========================================
// 2. ระบบเข้าสู่ระบบ (Login)
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  let connection;
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'กรุณากรอก Username และ Password' });
    }

    connection = await getDbConnection();

    if (!connection) {
      const user = localMockUsers.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
      if (!user) return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
      const safeUser = { user_id: user.user_id, username: user.username, email: user.email, role: user.role };
      const token = jwt.sign(
        { sub: user.user_id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({
        message: 'เข้าสู่ระบบสำเร็จ',
        token,
        user: safeUser
      });
    }

    const [rows] = await connection.execute(
      'SELECT * FROM user WHERE username = ? LIMIT 1',
      [username.trim()]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    const safeUser = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role || 'user'
    };

    const token = jwt.sign(
      { sub: user.user_id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'เข้าสู่ระบบไม่สำเร็จ: ' + error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// ==========================================
// 3. ระบบออกจากระบบ (Logout)
// ==========================================
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'ออกจากระบบเรียบร้อย' });
});

// ==========================================
// 4. ข้อมูล User ปัจจุบัน (Me)
// ==========================================
app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access Token Required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid Token' });
    res.json({ user: decoded });
  });
});

// ==========================================
// 5. ระบบสินค้า (Products API)
// ==========================================
// ดึงรายการสินค้า หรือค้นหาตามคำค้นหา
app.get('/api/products', async (req, res) => {
  let connection;
  try {
    const q = req.query.q ? `%${req.query.q}%` : null;
    connection = await getDbConnection();

    if (q) {
      const [rows] = await connection.execute(
        'SELECT * FROM products WHERE name LIKE ? OR category LIKE ? OR brand LIKE ? ORDER BY id DESC',
        [q, q, q]
      );
      return res.json(rows);
    }

    const [rows] = await connection.execute('SELECT * FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('โหลดสินค้าไม่สำเร็จ:', error.message);
    res.status(500).json({ error: 'ไม่สามารถโหลดสินค้าได้: ' + error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// เพิ่มสินค้าใหม่ (Insert)
app.post('/api/products', async (req, res) => {
  let connection;
  try {
    const { name, stock, price, category, location, image, status, brand, sizes, description, tis } = req.body;
    if (!name) return res.status(400).json({ error: 'กรุณาระบุชื่อสินค้า' });

    connection = await getDbConnection();
    const [result] = await connection.execute(
      `INSERT INTO products (name, stock, price, category, location, image, status, brand, sizes, description, tis)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        Number(stock || 0),
        Number(price || 0),
        category || 'ทั่วไป',
        location || 'คลังสินค้าหลัก',
        image || '',
        status || 'Active',
        brand || 'Eloop',
        sizes || '10,000 mAh',
        description || '',
        tis || 'มอก. 2879-2560'
      ]
    );

    res.status(201).json({ success: true, productId: result.insertId, message: 'เพิ่มสินค้าสำเร็จ' });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'ไม่สามารถเพิ่มสินค้าได้: ' + error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// แก้ไขสินค้า (Update)
app.put('/api/products/:id', async (req, res) => {
  let connection;
  try {
    const { name, stock, price, category, location, image, status, brand, sizes, description, tis } = req.body;
    connection = await getDbConnection();

    await connection.execute(
      `UPDATE products SET name=?, stock=?, price=?, category=?, location=?, image=?, status=?, brand=?, sizes=?, description=?, tis=?
       WHERE id=?`,
      [
        name,
        Number(stock || 0),
        Number(price || 0),
        category,
        location,
        image,
        status,
        brand,
        sizes,
        description,
        tis,
        req.params.id
      ]
    );

    res.json({ success: true, message: 'แก้ไขสินค้าเรียบร้อย' });
  } catch (error) {
    console.error('Edit product error:', error);
    res.status(500).json({ error: 'ไม่สามารถแก้ไขสินค้าได้: ' + error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// ลบสินค้า (Delete)
app.delete('/api/products/:id', async (req, res) => {
  let connection;
  try {
    connection = await getDbConnection();
    const [result] = await connection.execute('DELETE FROM products WHERE id=?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'ไม่พบสินค้านี้' });
    }

    res.json({ success: true, message: 'ลบสินค้าเรียบร้อย' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'ไม่สามารถลบสินค้าได้: ' + error.message });
  } finally {
    if (connection) await connection.end();
  }
});
// SPA Fallback: ถ้าไม่ใช่ /api ให้ส่ง index.html ของแอพกลับไป
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexFile = path.join(distPath, 'index.html');
  if (fs.existsSync(indexFile)) {
    return res.sendFile(indexFile);
  }
  res.json({ message: 'PowerBankShop API is running (dist folder not found)' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(` PowerBank Shop API running on port ${PORT}`);
});
