import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiCall, setAuthToken, setStoredUser } from '../lib/api';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const showMessage = (title: string, message: string, onOk?: () => void) => {
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(`${title}\n${message}`);
      if (onOk) onOk();
    } else {
      Alert.alert(
        title,
        message,
        onOk ? [{ text: 'ตกลง', onPress: onOk }] : undefined
      );
    }
  };

  const handleAuth = async () => {
    if (!username.trim() || !password.trim()) {
      showMessage('แจ้งเตือน', 'กรุณากรอกชื่อผู้ใช้ (Username) และรหัสผ่าน');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        // 1. Sign Up (บันทึก id user และข้อมูลลง MySQL)
        const res = await apiCall('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            username: username.trim(),
            password: password,
            email: email.trim() || undefined,
          }),
        });

        if (res.token) {
          await setAuthToken(res.token);
          await setStoredUser(res.user);
        }

        showMessage(
          'สำเร็จ',
          `สมัครสมาชิกเรียบร้อยแล้ว!\nUser ID ของคุณคือ: ${res.user?.user_id || 'สร้างแล้ว'}`,
          () => {
            router.replace('/');
          }
        );
        router.replace('/');
      } else {
        // 2. Login (ตรวจสอบข้อมูลจาก MySQL)
        const res = await apiCall('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            username: username.trim(),
            password: password,
          }),
        });

        if (res.token) {
          await setAuthToken(res.token);
          await setStoredUser(res.user);
        }

        showMessage(
          'สำเร็จ',
          `เข้าสู่ระบบสำเร็จ!\nยินดีต้อนรับคุณ ${res.user?.username} (ID: ${res.user?.user_id})`
        );

        router.replace('/');
      }
    } catch (error: any) {
      showMessage('เกิดข้อผิดพลาด', error.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🔋 PowerBank Shop</Text>
        <Text style={styles.subtitle}>
          {isRegister ? 'สมัครสมาชิก (Sign Up เข้า DB)' : 'เข้าสู่ระบบ (Login)'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="ชื่อผู้ใช้ (Username)"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        {isRegister && (
          <TextInput
            style={styles.input}
            placeholder="อีเมล (Email) - ไม่บังคับ"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="รหัสผ่าน (Password)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsRegister(!isRegister)}
          style={{ marginTop: 16 }}
        >
          <Text style={styles.switchText}>
            {isRegister
              ? 'มีบัญชีแล้ว? เข้าสู่ระบบ'
              : 'ยังไม่มีบัญชี? สมัครสมาชิก'}
          </Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20, padding: 12, backgroundColor: '#EFF6FF', borderRadius: 8, borderWidth: 1, borderColor: '#BFDBFE' }}>
          <Text style={{ fontSize: 13, color: '#1E40AF', fontWeight: 'bold', marginBottom: 4 }}>
            💡 ข้อมูลสำหรับเข้าสู่ระบบ:
          </Text>
          <Text style={{ fontSize: 12, color: '#1E3A8A' }}>
            • เข้าด้วยบัญชี Admin: <Text style={{ fontWeight: 'bold' }}>admin</Text> / รหัสผ่าน: <Text style={{ fontWeight: 'bold' }}>admin123</Text>
          </Text>
          <Text style={{ fontSize: 12, color: '#1E3A8A', marginTop: 2 }}>
            • หรือกด <Text style={{ fontWeight: 'bold' }}>"สมัครสมาชิก"</Text> ด้านบนเพื่อสร้างบัญชีใหม่และบันทึก User ID
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 48,
    backgroundColor: '#F3F4F6',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
    color: '#111827',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    color: '#2563EB',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
});