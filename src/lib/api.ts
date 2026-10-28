import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './constants';

type ApiOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
};

const AUTH_TOKEN_KEY = 'powerbank_auth_token';
const AUTH_USER_KEY = 'powerbank_user_info';
let authToken: string | null = null;

// โหลด Token จากเครื่อง
export async function loadAuthToken() {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  authToken = token;
  return token;
}

// บันทึก Token
export async function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

// บันทึกข้อมูลผู้ใช้ (user_id, username, email, role)
export async function setStoredUser(user: any) {
  if (user) {
    await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    await AsyncStorage.removeItem(AUTH_USER_KEY);
  }
}

// อ่านข้อมูลผู้ใช้ที่บันทึกไว้
export async function getStoredUser() {
  const data = await AsyncStorage.getItem(AUTH_USER_KEY);
  return data ? JSON.parse(data) : null;
}

// ล้าง Session เมื่อ Logout
export async function clearAuthSession() {
  authToken = null;
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  await AsyncStorage.removeItem(AUTH_USER_KEY);
}

// ฟังก์ชันเรียก API กลาง (Fetch Wrapper พร้อมแนบ JWT)
export async function apiCall(endpoint: string, options: ApiOptions = {}) {
  if (!authToken) {
    await loadAuthToken();
  }

  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${path}`;

  const config: ApiOptions = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  };

  const response = await fetch(url, config);
  const text = await response.text();

  let data: any;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const errorMessage = data?.error || data?.message || response.statusText;
    throw new Error(errorMessage);
  }

  return data;
}
