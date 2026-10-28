import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { supabase } from '../lib/supabase';

export default function ProductsScreen() {
  const [products, setProducts] = useState<any[]>([]);

  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [priceLevel, setPriceLevel] = useState('กลาง');
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      Alert.alert('เกิดข้อผิดพลาด', error.message);
      return;
    }

    setProducts(data || []);
  };

  const addProduct = async () => {
    if (!name.trim() || !price.trim() || !stock.trim()) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกชื่อสินค้า ราคา และจำนวนสินค้า');
      return;
    }

    const { error } = await supabase
      .from('products')
      .insert({
        name: name.trim(),
        capacity: capacity.trim(),
        price: Number(price),
        stock: Number(stock),
        price_level: priceLevel,
        image_url: imageUrl.trim(),
      });

    if (error) {
      Alert.alert('เพิ่มสินค้าไม่สำเร็จ', error.message);
      return;
    }

    Alert.alert('สำเร็จ', 'เพิ่มสินค้าเรียบร้อยแล้ว');

    setName('');
    setCapacity('');
    setPrice('');
    setStock('');
    setPriceLevel('กลาง');

    loadProducts();
  };
const updateProduct = async () => {
  if (!editingId) {
    return;
  }

  if (!name.trim() || !price.trim() || !stock.trim()) {
    Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบ');
    return;
  }

  const { error } = await supabase
    .from('products')
    .update({
      name: name.trim(),
      capacity: capacity.trim(),
      price: Number(price),
      stock: Number(stock),
      price_level: priceLevel,
      image_url: imageUrl.trim(),
    })
    .eq('id', editingId);

  if (error) {
    Alert.alert('แก้ไขสินค้าไม่สำเร็จ', error.message);
    return;
  }

  Alert.alert('สำเร็จ', 'แก้ไขสินค้าเรียบร้อยแล้ว');

  setEditingId(null);
  setName('');
  setCapacity('');
  setPrice('');
  setStock('');
  setPriceLevel('กลาง');
setImageUrl('');
setImageUrl('');

  loadProducts();
};

  const deleteProduct = async (id: number) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      Alert.alert('ลบสินค้าไม่สำเร็จ', error.message);
      return;
    }

    loadProducts();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📦 จัดการสินค้า</Text>

      <View style={styles.form}>
        <Text style={styles.label}>ชื่อสินค้า</Text>

        <TextInput
          style={styles.input}
          placeholder="เช่น Power Bank EW54"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>ความจุ</Text>

        <TextInput
          style={styles.input}
          placeholder="เช่น 10,000 mAh"
          value={capacity}
          onChangeText={setCapacity}
        />

        <Text style={styles.label}>ราคา</Text>

        <TextInput
          style={styles.input}
          placeholder="เช่น 990"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>จำนวนสินค้า</Text>

        <TextInput
          style={styles.input}
          placeholder="เช่น 20"
          keyboardType="numeric"
          value={stock}
          onChangeText={setStock}
          />
          <Text style={styles.label}>ระดับราคา</Text>

<View style={styles.priceLevelContainer}>
  {['ต่ำ', 'กลาง', 'สูง'].map((level) => (
    <TouchableOpacity
      key={level}
      style={[
        styles.priceLevelButton,
        priceLevel === level && styles.priceLevelButtonActive,
      ]}
      onPress={() => setPriceLevel(level)}
    >
      <Text
        style={[
          styles.priceLevelText,
          priceLevel === level && styles.priceLevelTextActive,
        ]}
      >
        {level}
      </Text>
    </TouchableOpacity>
  ))}
</View>

          <Text style={styles.label}>รูปสินค้า (URL)</Text>
<TextInput
  style={styles.input}
  placeholder="https://..."
  value={imageUrl}
  onChangeText={setImageUrl}
        />

        <TouchableOpacity
  style={styles.addButton}
  onPress={editingId ? updateProduct : addProduct}
>
  <Text style={styles.buttonText}>
    {editingId ? '💾 บันทึกการแก้ไข' : '＋ เพิ่มสินค้า'}
  </Text>
</TouchableOpacity>
      </View>

      <Text style={styles.listTitle}>รายการสินค้า</Text>

      {products.map((product) => (
        <View key={product.id} style={styles.productCard}>
            <Image
  source={{ uri: product.image_url }}
  style={styles.productImage}
/>
          <Text style={styles.productName}>
            {product.name}
          </Text>

          <Text>
            ความจุ: {product.capacity || '-'}
          </Text>

          <Text>
            ราคา: {Number(product.price).toLocaleString()} บาท
          </Text>

          <Text>
            คงเหลือ: {product.stock} ชิ้น
          </Text>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteProduct(product.id)}
          >
            <Text style={styles.buttonText}>
              🗑️ ลบสินค้า
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
  style={styles.editButton}
  onPress={() => {
    setEditingId(product.id);
    setName(product.name);
    setCapacity(product.capacity || '');
    setPrice(String(product.price));
    setStock(String(product.stock));
    setPriceLevel(product.price_level || 'กลาง');
  }}
>
  <Text style={styles.buttonText}>
    ✏️ แก้ไขสินค้า
  </Text>
</TouchableOpacity>

        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  form: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 7,
  },

priceLevelContainer: {
  flexDirection: 'row',
  gap: 10,
  marginBottom: 15,
},

priceLevelButton: {
  paddingVertical: 8,
  paddingHorizontal: 20,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#2563EB',
},

priceLevelButtonActive: {
  backgroundColor: '#2563EB',
},

priceLevelText: {
  color: '#2563EB',
  fontSize: 14,
},

priceLevelTextActive: {
  color: '#FFFFFF',
  fontWeight: 'bold',
},

  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    padding: 13,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },

  addButton: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  productCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
  },
  
productImage: {
  width: 180,
  height: 180,
  borderRadius: 10,
  marginBottom: 12,
  alignSelf: 'center',
},

  productName: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  deleteButton: {
    backgroundColor: '#FF4444',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },

editButton: {
  backgroundColor: '#2563EB',
  padding: 12,
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