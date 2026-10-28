import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      alert('โหลดคำสั่งซื้อไม่สำเร็จ: ' + error.message);
      return;
    }

    setOrders(data || []);
    const { data: items, error: itemsError } = await supabase
  .from('order_items')
  .select('*');

if (itemsError) {
  alert('โหลดรายการสินค้าไม่สำเร็จ: ' + itemsError.message);
  return;
}

setOrderItems(items || []);
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) {
    alert('เปลี่ยนสถานะไม่สำเร็จ: ' + error.message);
    return;
  }

  loadOrders();
};

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📋 จัดการคำสั่งซื้อ</Text>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/admin')}
      >
        <Text style={styles.buttonText}>← กลับหน้า Admin</Text>
      </TouchableOpacity>

      {orders.map((order) => (
        <View key={order.id} style={styles.orderCard}>
          <Text style={styles.orderTitle}>
            คำสั่งซื้อ #{order.id}
          </Text>

          <Text>ลูกค้า: {order.customer_name}</Text>
          <Text>เบอร์โทร: {order.customer_phone}</Text>
          <Text>ที่อยู่: {order.customer_address}</Text>
          <Text>ช่องทางชำระเงิน: {order.payment_method}</Text>

          <Text style={styles.total}>
            ยอดรวม: ฿{Number(order.total).toLocaleString()}
          </Text>

          <Text style={styles.status}>
            สถานะ: {order.status}
          </Text>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
  <TouchableOpacity
    style={{ backgroundColor: '#F59E0B', padding: 10, borderRadius: 8 }}
    onPress={() => updateOrderStatus(order.id, 'กำลังจัดส่ง')}
  >
    <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
      🚚 กำลังจัดส่ง
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={{ backgroundColor: '#16A34A', padding: 10, borderRadius: 8 }}
    onPress={() => updateOrderStatus(order.id, 'จัดส่งแล้ว')}
  >
    <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
      ✅ จัดส่งแล้ว
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={{ backgroundColor: '#DC2626', padding: 10, borderRadius: 8 }}
    onPress={() => updateOrderStatus(order.id, 'ยกเลิก')}
  >
    <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
      ❌ ยกเลิก
    </Text>
  </TouchableOpacity>
</View>

          {orderItems
  .filter((item) => item.order_id === order.id)
  .map((item) => (
    <View key={item.id} style={{ marginTop: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>
        📦 {item.product_name}
      </Text>

      <Text>
        จำนวน: {item.quantity} ชิ้น × ฿{Number(item.price).toLocaleString()}
      </Text>

      <Text>
        รวม: ฿{Number(item.subtotal).toLocaleString()}
      </Text>
    </View>
  ))}
        </View>
      ))}

      {orders.length === 0 && (
        <Text style={styles.empty}>
          ยังไม่มีคำสั่งซื้อ
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  backButton: {
    backgroundColor: '#666666',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  orderCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },

  orderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    marginTop: 12,
  },

  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },

  empty: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 30,
  },
});