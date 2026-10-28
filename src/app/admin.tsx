import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function AdminScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔋 PowerBank Shop</Text>

      <Text style={styles.subtitle}>
        🛠️ ระบบผู้ดูแลระบบ
      </Text>

     <TouchableOpacity
  style={styles.button}
  onPress={() => router.push('/products')}
>
  <Text style={styles.buttonText}>
    📦 จัดการสินค้า
  </Text>
</TouchableOpacity>

     <TouchableOpacity
  style={styles.button}
  onPress={() => router.push('/orders')}
>
        <Text style={styles.buttonText}>
          📋 จัดการคำสั่งซื้อ
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
  await supabase.auth.signOut();
  router.replace('/login');
}}
      >
        <Text style={styles.buttonText}>
          🚪 ออกจากระบบ
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#F5F7FA',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },

  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  button: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },

  logoutButton: {
    backgroundColor: '#FF4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});