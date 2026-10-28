import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import { useRouter } from 'expo-router';
import { GITHUB_JSON_URL } from '../lib/constants';
import { apiCall, getStoredUser, clearAuthSession } from '../lib/api';

const products = [
  {
    id: 1,
    name: 'PowerBank EW54',
    capacity: '10,000 mAh',
    price: 990,
    regularPrice: 1490,
    stock: 139,
    image: require('../../assets/products/10000mAh(2).webp'),
  },
  {
    id: 2,
    name: 'PowerBank EW55',
    capacity: '20,000 mAh',
    price: 1190,
    regularPrice: 1690,
    stock: 140,
    image: require('../../assets/products/20000mAh(1).webp'),
  },
  {
    id: 3,
    name: 'PowerBank E29',
    capacity: '30,000 mAh',
    price: 949,
    regularPrice: 1650,
    stock: 59,
    image: require('../../assets/products/30000mAh.webp'),
  },
  {
    id: 4,
    name: 'PowerBank E14 Ultra',
    capacity: '20,000 mAh',
    price: 1250,
    regularPrice: 1890,
    stock: 0,
    image: require('../../assets/products/E14(1).webp'),
  },
  {
    id: 5,
    name: 'PowerBank E48',
    capacity: '10,000 mAh',
    price: 590,
    regularPrice: 990,
    stock: 10,
    image: require('../../assets/products/E48.webp'),
  },
  {
    id: 6,
    name: 'PowerBank EW31',
    capacity: '10,000 mAh',
    price: 1050,
    regularPrice: 1890,
    stock: 126,
    image: require('../../assets/products/Ew31.webp'),
  },
  {
    id: 7,
    name: 'PowerBank EW40',
    capacity: '10,000 mAh',
    price: 1250,
    regularPrice: null,
    stock: 38,
    image: require('../../assets/products/EW40_CCC_1.webp'),
  },
  {
    id: 8,
    name: 'PowerBank EW50',
    capacity: '4,200 mAh',
    price: 890,
    regularPrice: 1090,
    stock: 0,
    image: require('../../assets/products/Ew50.webp'),
  },
  {
    id: 9,
    name: 'PowerBank EW52',
    capacity: '10,000 mAh',
    price: 990,
    regularPrice: 1490,
    stock: 137,
    image: require('../../assets/products/Ew52.webp'),
  },
  {
    id: 10,
    name: 'PowerBank E57',
    capacity: '10,000 mAh',
    price: 890,
    regularPrice: 1490,
    stock: 7,
    image: require('../../assets/products/Ew57.webp'),
  },
  {
    id: 11,
    name: 'PowerBank E29 Ultra',
    capacity: '30,000 mAh',
    price: 1250,
    regularPrice: 1990,
    stock: 59,
    image: require('../../assets/products/Ultra.webp'),
  },
];

const LOCAL_IMAGES: Record<string, any> = {
  '10000mAh(2).webp': require('../../assets/products/10000mAh(2).webp'),
  '20000mAh(1).webp': require('../../assets/products/20000mAh(1).webp'),
  '30000mAh.webp': require('../../assets/products/30000mAh.webp'),
  'E14(1).webp': require('../../assets/products/E14(1).webp'),
  'E48.webp': require('../../assets/products/E48.webp'),
  'Ew31.webp': require('../../assets/products/Ew31.webp'),
  'EW40_CCC_1.webp': require('../../assets/products/EW40_CCC_1.webp'),
  'Ew50.webp': require('../../assets/products/Ew50.webp'),
  'Ew52.webp': require('../../assets/products/Ew52.webp'),
  'Ew57.webp': require('../../assets/products/Ew57.webp'),
  'Ultra.webp': require('../../assets/products/Ultra.webp'),
};

const getProductImage = (product: any) => {
  if (!product) return LOCAL_IMAGES['10000mAh(2).webp'];

  // 1. ถ้ามี local_asset ระบุตรงๆ
  if (product.local_asset && LOCAL_IMAGES[product.local_asset]) {
    return LOCAL_IMAGES[product.local_asset];
  }

  // 2. จับคู่ตามชื่อรุ่นและรหัสสินค้า PowerBank
  const name = String(product.name || '').toUpperCase();
  const code = String(product.productCode || product.id || '').toUpperCase();

  if (name.includes('EW54') || code.includes('EW54') || code === 'PB-001') return LOCAL_IMAGES['10000mAh(2).webp'];
  if (name.includes('EW55') || code.includes('EW55') || code === 'PB-002') return LOCAL_IMAGES['20000mAh(1).webp'];
  if (name.includes('E29 ULTRA') || code.includes('PB-011')) return LOCAL_IMAGES['Ultra.webp'];
  if (name.includes('E29') || code.includes('EW29') || code === 'PB-003') return LOCAL_IMAGES['30000mAh.webp'];
  if (name.includes('E14') || code.includes('E14') || code === 'PB-004') return LOCAL_IMAGES['E14(1).webp'];
  if (name.includes('E48') || code.includes('E48') || code === 'PB-005') return LOCAL_IMAGES['E48.webp'];
  if (name.includes('EW31') || code.includes('EW31') || code === 'PB-006') return LOCAL_IMAGES['Ew31.webp'];
  if (name.includes('EW40') || code.includes('EW40') || code === 'PB-007') return LOCAL_IMAGES['EW40_CCC_1.webp'];
  if (name.includes('EW50') || code.includes('EW50') || code === 'PB-008') return LOCAL_IMAGES['Ew50.webp'];
  if (name.includes('EW52') || code.includes('EW52') || code === 'PB-009') return LOCAL_IMAGES['Ew52.webp'];
  if (name.includes('E57') || code.includes('E57') || code === 'PB-010') return LOCAL_IMAGES['Ew57.webp'];
  if (name.includes('ULTRA')) return LOCAL_IMAGES['Ultra.webp'];

  // 3. ถ้าเป็น URL รูปออนไลน์จริง
  if (product.image_url && typeof product.image_url === 'string' && !product.image_url.includes('Chamaiporn-K')) {
    return { uri: product.image_url };
  }
  if (product.image && typeof product.image === 'string' && !product.image.includes('Chamaiporn-K')) {
    return { uri: product.image };
  }

  // 4. Default fallback
  return LOCAL_IMAGES['10000mAh(2).webp'];
};

const getProductPriceLevel = (price: number) => {
  if (price < 900) return 'ต่ำ';
  if (price <= 1100) return 'กลาง';
  return 'สูง';
};

export default function HomeScreen() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
const [showCart, setShowCart] = useState(false);
const [showCheckout, setShowCheckout] = useState(false);
const [orders, setOrders] = useState<any[]>([]);
useEffect(() => {
const loadOrders = async () => {
  try {
    const saved = await AsyncStorage.getItem('user_orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  } catch (error) {
    console.log('โหลดประวัติการสั่งซื้อไม่สำเร็จ', error);
  }
};
  loadOrders();
}, []);

const [showOrders, setShowOrders] = useState(false);
const [customerName, setCustomerName] = useState('');
const [customerPhone, setCustomerPhone] = useState('');
const [customerAddress, setCustomerAddress] = useState('');
const [paymentMethod, setPaymentMethod] = useState('');
const [showAddProduct, setShowAddProduct] = useState(false);

const [newProductName, setNewProductName] = useState('');
const [newProductCapacity, setNewProductCapacity] = useState('');
const [newProductPrice, setNewProductPrice] = useState('');
const [newProductStock, setNewProductStock] = useState('');
const [newProductImage, setNewProductImage] = useState<string | null>(null);
const [showEditProduct, setShowEditProduct] = useState(false);
const [editProduct, setEditProduct] = useState<any>(null);

const [editProductName, setEditProductName] = useState('');
const [editProductCapacity, setEditProductCapacity] = useState('');
const [editProductPrice, setEditProductPrice] = useState('');
const [editProductStock, setEditProductStock] = useState('');
const [editProductImage, setEditProductImage] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const [isGrid, setIsGrid] = useState(true);

const [productList, setProductList] = useState<any[]>([]);
const [selectedPriceLevel, setSelectedPriceLevel] = useState('ทั้งหมด');
const [userId, setUserId] = useState<string | null>(null);
const [userRole, setUserRole] = useState('user');
const loadProducts = async () => {
  // 1. ดึงรูปและรายละเอียดจาก JSON ที่อัปในกิต (GitHub Raw URL)
  try {
    const res = await fetch(GITHUB_JSON_URL);
    if (res.ok) {
      const gitData = await res.json();
      if (Array.isArray(gitData) && gitData.length > 0) {
        setProductList(gitData);
        return;
      }
    }
  } catch (e) {
    console.log('GitHub JSON fetch error, trying backend API:', e);
  }

  // 2. ถ้าเน็ตขัดข้อง ให้ลองดึงจาก Backend API
  try {
    const apiData = await apiCall('/products');
    if (Array.isArray(apiData) && apiData.length > 0) {
      setProductList(apiData);
      return;
    } else if (apiData.items && apiData.items.length > 0) {
      setProductList(apiData.items);
      return;
    }
  } catch (err) {
    console.log('API fetch error, using local fallback:', err);
  }

  // 3. Fallback เป็นข้อมูลสินค้าในเครื่อง
  setProductList(products);
};

const handleLogout = async () => {
  try {
    await apiCall('/auth/logout', { method: 'POST' }).catch(() => {});
  } finally {
    await clearAuthSession();
    router.replace('/login');
  }
};

useEffect(() => {
  const loadUser = async () => {
    const user = await getStoredUser();
    if (user) {
      setCurrentUser(user);
      setUserId(String(user.user_id));
      setUserRole(user.role || 'user');
    }
  };

  loadUser();
  loadProducts();
}, []);

  const filteredProducts = productList.filter((product) => {
    const matchesSearch =
      `${product.name} ${product.capacity}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const level = product.price_level || getProductPriceLevel(product.price);
    const matchesPriceLevel =
      selectedPriceLevel === 'ทั้งหมด' ||
      level === selectedPriceLevel;

    return matchesSearch && matchesPriceLevel;
  });
  
  const addToCart = (product: any) => {
  setCart((currentCart) => {
    const existingProduct = currentCart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      if (existingProduct.quantity >= product.stock) {
        alert('ไม่สามารถเพิ่มสินค้าเกินจำนวน Stock ได้');
        return currentCart;
      }

      return currentCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );
    }

    return [
      ...currentCart,
      {
        ...product,
        quantity: 1,
      },
    ];
  });

  // ปิดหน้ารายละเอียดสินค้า
  setSelectedProduct(null);

};
   
const increaseQuantity = (id: number) => {
  setCart((currentCart) =>
    currentCart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity:
              item.quantity < item.stock
                ? item.quantity + 1
                : item.quantity,
          }
        : item
    )
  );
};

const decreaseQuantity = (id: number) => {
  setCart((currentCart) =>
    currentCart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0)
  );
};

const removeFromCart = (id: number) => {
  setCart((currentCart) =>
    currentCart.filter((item) => item.id !== id)
  );
};

const openEditProduct = (product: any) => {
  setEditProduct(product);
  setEditProductName(product.name);
  setEditProductCapacity(product.capacity);
  setEditProductPrice(String(product.price));
  setEditProductStock(String(product.stock));
  setEditProductImage(null);
  setShowEditProduct(true);
};

const removeProduct = async (id: number) => {
  try {
    await apiCall(`/products/${id}`, { method: 'DELETE' });
  } catch (err: any) {
    console.log('DELETE ERROR / NOTE:', err?.message || err);
  }
 
  setProductList((currentProducts) =>
    currentProducts.filter((product) => product.id !== id)
  );

  setCart((currentCart) =>
    currentCart.filter((item) => item.id !== id)
  );

  if (selectedProduct?.id === id) {
    setSelectedProduct(null);
  }

  alert('ลบสินค้าแล้ว');
};
const updateOrderStatus = async (
  orderId: number,
  newStatus: string
) => {
  const updatedOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status: newStatus,
        }
      : order
  );

  setOrders(updatedOrders);

  await AsyncStorage.setItem(
    'orders',
    JSON.stringify(updatedOrders)
  );
};
const updateProduct = () => {
  if (
    !editProductName.trim() ||
    !editProductCapacity.trim() ||
    !editProductPrice.trim() ||
    !editProductStock.trim()
  ) {
    alert('กรุณากรอกข้อมูลให้ครบ');
    return;
  }

  setProductList((currentProducts) =>
    currentProducts.map((product) =>
      product.id === editProduct.id
        ? {
            ...product,
            name: editProductName.trim(),
            capacity: editProductCapacity.trim(),
            price: Number(editProductPrice),
            stock: Number(editProductStock),
            image: editProductImage
              ? { uri: editProductImage }
              : product.image,
          }
        : product
    )
  );

  setShowEditProduct(false);
  setEditProduct(null);
  setEditProductImage(null);

  alert('แก้ไขสินค้าสำเร็จ');
};

const pickProductImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    setNewProductImage(result.assets[0].uri);
  }
};
const addProduct = () => {
  if (
    !newProductName.trim() ||
    !newProductCapacity.trim() ||
    !newProductPrice.trim() ||
    !newProductStock.trim()
  ) {
    alert('กรุณากรอกข้อมูลให้ครบ');
    return;
  }

  const newProduct = {
    id: productList.length > 0
      ? Math.max(...productList.map((product) => product.id)) + 1
      : 1,
    name: newProductName.trim(),
    capacity: newProductCapacity.trim(),
    price: Number(newProductPrice),
    regularPrice: null,
    stock: Number(newProductStock),
    image: newProductImage
  ? { uri: newProductImage }
  : products[0].image,
  };

  setProductList((currentProducts) => [
    ...currentProducts,
    newProduct,
  ]);

  setNewProductName('');
  setNewProductCapacity('');
  setNewProductPrice('');
  setNewProductStock('');
setNewProductImage(null);
  setShowAddProduct(false);

  alert('เพิ่มสินค้าสำเร็จ');
};
  return (  
  <>
<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Header Navigation Bar (Top Row) */}
      <View style={styles.navBar}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandIcon}>⚡</Text>
          <View>
            <Text style={styles.brandTitle} numberOfLines={1}>PowerBank Shop</Text>
            <Text style={styles.brandSubtitle}>ร้านขายพาวเวอร์แบงค์</Text>
          </View>
        </View>

        <View style={styles.navActions}>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => setShowOrders(true)}
            accessibilityLabel="ประวัติการสั่งซื้อ"
          >
            <Text style={styles.iconButtonEmoji}>📋</Text>
            {orders.length > 0 && (
              <View style={styles.navBadge}>
                <Text style={styles.navBadgeText}>{orders.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, styles.cartIconButton]}
            activeOpacity={0.7}
            onPress={() => setShowCart(true)}
            accessibilityLabel="ตะกร้าสินค้า"
          >
            <Text style={styles.iconButtonEmoji}>🛒</Text>
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.7}
            onPress={handleLogout}
            accessibilityLabel="ออกจากระบบ"
          >
            <Text style={styles.logoutIconEmoji}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. User Info & Role Banner */}
      <View style={styles.userBanner}>
        <View style={styles.userLeft}>
          <View style={[styles.userAvatar, userRole === 'admin' ? styles.userAvatarAdmin : styles.userAvatarMember]}>
            <Text style={styles.avatarEmoji}>{userRole === 'admin' ? '👑' : '👤'}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <View style={styles.userNameRow}>
              <Text style={styles.userNameText} numberOfLines={1}>
                {currentUser?.username ? `สวัสดี, ${currentUser.username}` : 'ยินดีต้อนรับ'}
              </Text>
              {userRole === 'admin' ? (
                <View style={styles.roleBadgeAdmin}>
                  <Text style={styles.roleBadgeAdminText}>🛡️ Admin</Text>
                </View>
              ) : (
                <View style={styles.roleBadgeUser}>
                  <Text style={styles.roleBadgeUserText}>👤 สมาชิก</Text>
                </View>
              )}
            </View>
            <Text style={styles.userIdText}>
              รหัสสมาชิก: #{userId || currentUser?.user_id || '2'}
            </Text>
          </View>
        </View>

        {userRole === 'admin' && (
          <TouchableOpacity
            style={styles.adminQuickAddBtn}
            activeOpacity={0.8}
            onPress={() => setShowAddProduct(true)}
          >
            <Text style={styles.adminQuickAddText}>➕ เพิ่มสินค้า</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 3. Search Box */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหาชื่อรุ่น หรือ ความจุ mAh..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearSearchBtn}>
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 4. Section Row */}
      <View style={styles.sectionRow}>
        <View>
          <Text style={styles.sectionTitle}>สินค้าทั้งหมด</Text>
          <Text style={styles.productCount}>
            พบ {filteredProducts.length} รายการ
          </Text>
        </View>

        {/* Layout Mode Toggle (2 คอลัมน์ / เต็มจอ) */}
        <View style={styles.layoutToggleContainer}>
          <TouchableOpacity
            style={[styles.layoutToggleBtn, isGrid && styles.layoutToggleBtnActive]}
            onPress={() => setIsGrid(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.layoutToggleText, isGrid && styles.layoutToggleTextActive]}>
              ⊞ 2 รายการ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.layoutToggleBtn, !isGrid && styles.layoutToggleBtnActive]}
            onPress={() => setIsGrid(false)}
            activeOpacity={0.7}
          >
            <Text style={[styles.layoutToggleText, !isGrid && styles.layoutToggleTextActive]}>
              ☰ เต็มจอ
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 5. Price Level Filters */}
      <View style={styles.priceFilterContainer}>
        {[
          { key: 'ทั้งหมด', label: 'ทั้งหมด' },
          { key: 'ต่ำ', label: 'ต่ำ (<฿900)' },
          { key: 'กลาง', label: 'กลาง (฿900-1.1k)' },
          { key: 'สูง', label: 'สูง (>฿1.1k)' },
        ].map((item) => {
          const isActive = selectedPriceLevel === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.priceFilterButton,
                isActive && styles.priceFilterButtonActive,
              ]}
              onPress={() => setSelectedPriceLevel(item.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.priceFilterText,
                  isActive && styles.priceFilterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 6. Products Grid / List */}
      <View style={styles.productList}>
        {filteredProducts.map((product) => {
          const originalPrice = product.regularPrice || product.regular_Price;
          const hasDiscount = originalPrice && originalPrice > product.price;
          const discountPercent = hasDiscount
            ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
            : 0;
          const priceLevel = product.price_level || getProductPriceLevel(product.price);

          return (
            <View
              style={isGrid ? styles.cardGrid : styles.cardList}
              key={product.id}
            >
              {/* Product Image Box with Floating Badges */}
              <View style={isGrid ? styles.imageBoxGrid : styles.imageBoxList}>
                <Image
                  source={getProductImage(product)}
                  style={isGrid ? styles.imageGrid : styles.imageList}
                  resizeMode="contain"
                />

                {/* Capacity Pill (Top-Left) */}
                <View style={isGrid ? styles.badgeCapacityGrid : styles.badgeCapacity}>
                  <Text style={isGrid ? styles.badgeCapacityTextGrid : styles.badgeCapacityText}>
                    ⚡ {product.capacity}
                  </Text>
                </View>

                {/* Stock Status Pill (Top-Right) */}
                {product.stock > 0 ? (
                  <View style={isGrid ? styles.badgeInStockGrid : styles.badgeInStock}>
                    <Text style={isGrid ? styles.badgeInStockTextGrid : styles.badgeInStockText}>
                      ✓ {isGrid ? `${product.stock}` : `เหลือ ${product.stock} ชิ้น`}
                    </Text>
                  </View>
                ) : (
                  <View style={isGrid ? styles.badgeOutOfStockGrid : styles.badgeOutOfStock}>
                    <Text style={isGrid ? styles.badgeOutOfStockTextGrid : styles.badgeOutOfStockText}>
                      ✕ หมด
                    </Text>
                  </View>
                )}
              </View>

              {/* Product Information */}
              <View style={isGrid ? styles.productInfoGrid : styles.productInfo}>
                <Text style={isGrid ? styles.productNameGrid : styles.productName} numberOfLines={1}>
                  {product.name}
                </Text>

                <View style={styles.metaRow}>
                  <View style={styles.priceLevelBadge}>
                    <Text style={styles.priceLevelBadgeText}>
                      🏷️ ระดับ{priceLevel}
                    </Text>
                  </View>
                </View>

                {/* Price Row */}
                <View style={styles.priceRow}>
                  <Text style={isGrid ? styles.priceGrid : styles.price}>
                    ฿{product.price.toLocaleString()}
                  </Text>

                  {hasDiscount && (
                    <>
                      <Text style={isGrid ? styles.regularPriceGrid : styles.regularPrice}>
                        ฿{originalPrice.toLocaleString()}
                      </Text>
                      <View style={styles.discountBadge}>
                        <Text style={isGrid ? styles.discountBadgeTextGrid : styles.discountBadgeText}>
                          -{discountPercent}%
                        </Text>
                      </View>
                    </>
                  )}
                </View>

                {/* Order / Detail Button */}
                <TouchableOpacity
                  style={[
                    isGrid ? styles.detailButtonGrid : styles.detailButton,
                    product.stock === 0 && styles.disabledButton,
                  ]}
                  disabled={product.stock === 0}
                  onPress={() => setSelectedProduct(product)}
                  activeOpacity={0.8}
                >
                  <Text style={isGrid ? styles.detailTextGrid : styles.detailText}>
                    {product.stock === 0 ? '✕ สินค้าหมด' : '🛒 ดูรายละเอียด'}
                  </Text>
                </TouchableOpacity>

                {/* Admin Action Buttons (Side by Side) */}
                {userRole === 'admin' && (
                  <View style={styles.adminActionRow}>
                    <TouchableOpacity
                      style={styles.adminEditButton}
                      activeOpacity={0.8}
                      onPress={() => openEditProduct(product)}
                    >
                      <Text style={isGrid ? styles.adminActionTextGrid : styles.adminEditButtonText}>✏️ แก้ไข</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.adminDeleteButton}
                      activeOpacity={0.8}
                      onPress={() => removeProduct(product.id)}
                    >
                      <Text style={isGrid ? styles.adminActionTextGrid : styles.adminDeleteButtonText}>🗑️ ลบ</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <View style={styles.noResult}>
          <Text style={styles.noResultIcon}>🔍</Text>
          <Text style={styles.noResultTitle}>ไม่พบสินค้าที่คุณค้นหา</Text>
          <Text style={styles.noResultText}>ลองค้นหาด้วยคำอื่น หรือเลือกระดับราคา "ทั้งหมด"</Text>
          <TouchableOpacity
            style={styles.resetFilterBtn}
            onPress={() => {
              setSearch('');
              setSelectedPriceLevel('ทั้งหมด');
            }}
          >
            <Text style={styles.resetFilterText}>🔄 ล้างตัวกรองทั้งหมด</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Admin Bottom Add Button */}
      {userRole === 'admin' && (
        <TouchableOpacity
          style={styles.adminFooterAddBtn}
          onPress={() => setShowAddProduct(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.adminFooterAddText}>➕ เพิ่มสินค้าใหม่ (Admin)</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>

    {/* 1. Product Detail Modal */}
    {selectedProduct && (
      <Modal
        visible={true}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setSelectedProduct(null)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
              <Image
                source={getProductImage(selectedProduct)}
                style={styles.detailImage}
                resizeMode="contain"
              />

              <Text style={styles.detailName}>
                {selectedProduct.name}
              </Text>

              <View style={styles.detailBadgeRow}>
                <View style={styles.detailBadgePill}>
                  <Text style={styles.detailBadgePillText}>⚡ ความจุ {selectedProduct.capacity}</Text>
                </View>
                <View style={styles.detailLevelPill}>
                  <Text style={styles.detailLevelPillText}>
                    🏷️ ระดับ{selectedProduct.price_level || getProductPriceLevel(selectedProduct.price)}
                  </Text>
                </View>
              </View>

              <View style={styles.detailPriceRow}>
                <Text style={styles.detailPrice}>
                  ฿{selectedProduct.price.toLocaleString()}
                </Text>

                {(selectedProduct.regularPrice || selectedProduct.regular_Price) && (
                  <Text style={styles.detailRegularPrice}>
                    ฿{(selectedProduct.regularPrice || selectedProduct.regular_Price).toLocaleString()}
                  </Text>
                )}
              </View>

              {selectedProduct.stock > 0 ? (
                <Text style={styles.detailStock}>
                  ✓ มีสินค้า พร้อมส่ง {selectedProduct.stock} ชิ้น
                </Text>
              ) : (
                <Text style={styles.detailOutStock}>
                  ✕ สินค้าหมดชั่วคราว
                </Text>
              )}

              <Text style={styles.detailDescription}>
                PowerBank คุณภาพสูง ได้มาตรฐานความปลอดภัย มอก. ป้องกันไฟกระชาก ไฟฟ้าลัดวงจร รองรับ Fast Charging พกพาสะดวก เหมาะสำหรับสมาร์ทโฟนและแท็บเล็ตทุกรุ่น
              </Text>

              <TouchableOpacity
                style={[styles.cartButton, selectedProduct.stock === 0 && styles.disabledButton]}
                disabled={selectedProduct.stock === 0}
                onPress={() => addToCart(selectedProduct)}
                activeOpacity={0.8}
              >
                <Text style={styles.cartButtonText}>
                  {selectedProduct.stock === 0 ? '✕ สินค้าหมด' : '🛒 เพิ่มลงในตะกร้า'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    )}

    {/* 2. Cart Modal */}
    <Modal
      visible={showCart}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowCart(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => setShowCart(false)}
          >
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>🛒 ตะกร้าสินค้า</Text>

          {cart.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🛒</Text>
              <Text style={styles.emptyCart}>ยังไม่มีสินค้าในตะกร้า</Text>
              <Text style={styles.emptySubtext}>เลือกสินค้าที่คุณต้องการสั่งซื้อได้ที่หน้าแรก</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%', maxHeight: 380 }}>
              {cart.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <Image
                    source={getProductImage(item)}
                    style={styles.cartImage}
                    resizeMode="contain"
                  />

                  <View style={styles.cartInfo}>
                    <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>฿{item.price.toLocaleString()}</Text>

                    <View style={styles.cartQuantityRow}>
                      <TouchableOpacity
                        onPress={() => decreaseQuantity(item.id)}
                        style={styles.qtyBtn}
                      >
                        <Text style={styles.qtyBtnText}>−</Text>
                      </TouchableOpacity>

                      <Text style={styles.qtyText}>{item.quantity}</Text>

                      <TouchableOpacity
                        onPress={() => increaseQuantity(item.id)}
                        disabled={item.quantity >= item.stock}
                        style={[styles.qtyBtn, item.quantity >= item.stock && { opacity: 0.4 }]}
                      >
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => removeFromCart(item.id)}
                        style={styles.deleteCartItemBtn}
                      >
                        <Text style={styles.deleteCartItemText}>ลบ</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {cart.length > 0 && (
            <View style={{ width: '100%', marginTop: 15, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 12 }}>
              <View style={styles.cartTotalRow}>
                <Text style={styles.cartTotalLabel}>ยอดรวมทั้งหมด:</Text>
                <Text style={styles.cartTotalAmount}>
                  ฿{cart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.checkoutButton}
                activeOpacity={0.8}
                onPress={() => {
                  setShowCart(false);
                  setShowCheckout(true);
                }}
              >
                <Text style={styles.checkoutText}>ดำเนินการสั่งซื้อ →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>

    {/* 3. Checkout Modal */}
    <Modal
      visible={showCheckout}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowCheckout(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => setShowCheckout(false)}
          >
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>📦 ยืนยันการสั่งซื้อ</Text>

          <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
            <Text style={styles.checkoutSectionTitle}>รายการสินค้าในคำสั่งซื้อ</Text>
            {cart.map((item) => (
              <View key={item.id} style={styles.checkoutItem}>
                <Text style={styles.checkoutItemName}>{item.name}</Text>
                <Text style={styles.checkoutItemDetail}>
                  {item.quantity} ชิ้น × ฿{item.price.toLocaleString()} = ฿{(item.quantity * item.price).toLocaleString()}
                </Text>
              </View>
            ))}

            <View style={styles.checkoutLine} />

            <View style={styles.checkoutTotalRow}>
              <Text style={styles.checkoutTotalLabel}>ยอดชำระสุทธิ:</Text>
              <Text style={styles.checkoutTotalAmount}>
                ฿{cart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}
              </Text>
            </View>

            <Text style={styles.checkoutSectionTitle}>ข้อมูลสำหรับจัดส่ง</Text>
            <TextInput
              style={styles.formInput}
              placeholder="ชื่อ-นามสกุล ผู้รับ *"
              placeholderTextColor="#94A3B8"
              value={customerName}
              onChangeText={setCustomerName}
            />

            <TextInput
              style={styles.formInput}
              placeholder="เบอร์โทรศัพท์ติดต่อ *"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={customerPhone}
              onChangeText={setCustomerPhone}
            />

            <TextInput
              style={[styles.formInput, styles.addressInput]}
              placeholder="ที่อยู่สำหรับจัดส่ง (บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์) *"
              placeholderTextColor="#94A3B8"
              multiline
              value={customerAddress}
              onChangeText={setCustomerAddress}
            />

            <Text style={styles.checkoutSectionTitle}>วิธีชำระเงิน</Text>
            <View style={styles.paymentContainer}>
              {[
                { key: 'เก็บปลายทาง', icon: '💵', label: 'เก็บเงินปลายทาง (COD)' },
                { key: 'โอนเงิน', icon: '🏦', label: 'โอนผ่านบัญชีธนาคาร' },
                { key: 'บัตรเครดิต', icon: '💳', label: 'บัตรเครดิต / เดบิต' },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.paymentOption,
                    paymentMethod === opt.key && styles.paymentSelected,
                  ]}
                  onPress={() => setPaymentMethod(opt.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.paymentText, paymentMethod === opt.key && styles.paymentTextSelected]}>
                    {opt.icon} {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.confirmOrderButton}
              activeOpacity={0.8}
              onPress={async () => {
                if (
                  !customerName.trim() ||
                  !customerPhone.trim() ||
                  !customerAddress.trim() ||
                  !paymentMethod
                ) {
                  alert('กรุณากรอกข้อมูลผู้รับและเลือกวิธีชำระเงินให้ครบถ้วน');
                  return;
                }

                setProductList((currentProducts) =>
                  currentProducts.map((product) => {
                    const cartItem = cart.find((item) => item.id === product.id);
                    if (cartItem) {
                      return {
                        ...product,
                        stock: Math.max(0, product.stock - cartItem.quantity),
                      };
                    }
                    return product;
                  })
                );

                const newOrder = {
                  id: Date.now(),
                  user_id: userId,
                  items: [...cart],
                  total: cart.reduce((total, item) => total + item.price * item.quantity, 0),
                  date: new Date().toLocaleString('th-TH'),
                  status: 'รอจัดส่ง',
                  customerName: customerName.trim(),
                  customerPhone: customerPhone.trim(),
                  customerAddress: customerAddress.trim(),
                  paymentMethod: paymentMethod,
                };

                const updatedOrders = [newOrder, ...orders];
                setOrders(updatedOrders);
                await AsyncStorage.setItem('user_orders', JSON.stringify(updatedOrders));

                alert('🎉 สั่งซื้อสินค้าสำเร็จ!\nระบบได้บันทึกคำสั่งซื้อของคุณแล้ว');
                setShowCheckout(false);
                setCart([]);
                setCustomerName('');
                setCustomerPhone('');
                setCustomerAddress('');
                setPaymentMethod('');
              }}
            >
              <Text style={styles.confirmOrderText}>ยืนยันและสั่งซื้อสินค้า</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>

    {/* 4. Orders Modal */}
    <Modal
      visible={showOrders}
      transparent
      animationType="fade"
      onRequestClose={() => setShowOrders(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => setShowOrders(false)}
          >
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>📋 ประวัติการสั่งซื้อ</Text>

          {orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyCart}>ยังไม่มีประวัติคำสั่งซื้อ</Text>
              <Text style={styles.emptySubtext}>เมื่อคุณทำการสั่งซื้อ รายการจะแสดงที่นี่</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
              {orders.map((order) => {
                const statusColor =
                  order.status === 'รอจัดส่ง'
                    ? '#F59E0B'
                    : order.status === 'กำลังจัดส่ง'
                    ? '#2563EB'
                    : '#16A34A';
                const statusBg =
                  order.status === 'รอจัดส่ง'
                    ? '#FEF3C7'
                    : order.status === 'กำลังจัดส่ง'
                    ? '#EFF6FF'
                    : '#DCFCE7';

                return (
                  <View key={order.id} style={styles.orderCard}>
                    <View style={styles.orderCardHeader}>
                      <Text style={styles.orderNumber}>คำสั่งซื้อ #{order.id}</Text>
                      <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
                        <Text style={[styles.statusPillText, { color: statusColor }]}>
                          {order.status === 'รอจัดส่ง' ? '🟠' : order.status === 'กำลังจัดส่ง' ? '🔵' : '🟢'} {order.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.orderDate}>📅 วันที่: {order.date}</Text>

                    <View style={styles.orderCustomerBox}>
                      <Text style={styles.orderCustomerText}>👤 ผู้รับ: {order.customerName} ({order.customerPhone})</Text>
                      <Text style={styles.orderCustomerText}>📍 ที่อยู่: {order.customerAddress}</Text>
                      <Text style={styles.orderCustomerText}>💳 วิธีชำระ: {order.paymentMethod}</Text>
                    </View>

                    <View style={styles.orderItemsBox}>
                      {(order.items || []).map((item: any, idx: number) => (
                        <Text key={idx} style={styles.orderItemRow}>
                          • {item.name} × {item.quantity} (฿{(item.price * item.quantity).toLocaleString()})
                        </Text>
                      ))}
                    </View>

                    <View style={styles.orderFooterRow}>
                      <Text style={styles.orderTotalLabel}>ยอดสุทธิ:</Text>
                      <Text style={styles.orderTotalAmount}>฿{order.total.toLocaleString()}</Text>
                    </View>

                    {/* Admin Status Transition Controls */}
                    {userRole === 'admin' && order.status === 'รอจัดส่ง' && (
                      <TouchableOpacity
                        style={[styles.statusChangeBtn, { backgroundColor: '#2563EB' }]}
                        onPress={() => updateOrderStatus(order.id, 'กำลังจัดส่ง')}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.statusChangeBtnText}>🚚 ปรับสถานะเป็น "กำลังจัดส่ง"</Text>
                      </TouchableOpacity>
                    )}

                    {userRole === 'admin' && order.status === 'กำลังจัดส่ง' && (
                      <TouchableOpacity
                        style={[styles.statusChangeBtn, { backgroundColor: '#16A34A' }]}
                        onPress={() => updateOrderStatus(order.id, 'จัดส่งสำเร็จ')}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.statusChangeBtnText}>✅ ปรับสถานะเป็น "จัดส่งสำเร็จ"</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>

    {/* 5. Add Product Modal (Admin) */}
    <Modal
      visible={showAddProduct}
      transparent
      animationType="fade"
      onRequestClose={() => setShowAddProduct(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => setShowAddProduct(false)}
          >
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>➕ เพิ่มสินค้าใหม่</Text>

          <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
            <TouchableOpacity
              style={styles.pickImageBtn}
              onPress={pickProductImage}
              activeOpacity={0.8}
            >
              <Text style={styles.pickImageBtnText}>
                {newProductImage ? '✓ เปลี่ยนรูปภาพแล้ว' : '🖼️ เลือกรูปภาพสินค้า'}
              </Text>
            </TouchableOpacity>

            {newProductImage && (
              <Image
                source={{ uri: newProductImage }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            )}

            <TextInput
              style={styles.formInput}
              placeholder="ชื่อสินค้า เช่น PowerBank EW54"
              placeholderTextColor="#94A3B8"
              value={newProductName}
              onChangeText={setNewProductName}
            />

            <TextInput
              style={styles.formInput}
              placeholder="ความจุ เช่น 10,000 mAh"
              placeholderTextColor="#94A3B8"
              value={newProductCapacity}
              onChangeText={setNewProductCapacity}
            />

            <TextInput
              style={styles.formInput}
              placeholder="ราคาขาย (บาท) เช่น 990"
              placeholderTextColor="#94A3B8"
              value={newProductPrice}
              onChangeText={setNewProductPrice}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.formInput}
              placeholder="จำนวนสินค้าในสต็อก เช่น 50"
              placeholderTextColor="#94A3B8"
              value={newProductStock}
              onChangeText={setNewProductStock}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={addProduct}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>บันทึกสินค้าใหม่</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>

    {/* 6. Edit Product Modal (Admin) */}
    <Modal
      visible={showEditProduct}
      transparent
      animationType="fade"
      onRequestClose={() => setShowEditProduct(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => setShowEditProduct(false)}
          >
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>✏️ แก้ไขสินค้า</Text>

          <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
            <TouchableOpacity
              style={styles.pickImageBtn}
              onPress={async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  quality: 1,
                });
                if (!result.canceled) {
                  setEditProductImage(result.assets[0].uri);
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.pickImageBtnText}>🖼️ เปลี่ยนรูปสินค้า</Text>
            </TouchableOpacity>

            {editProductImage && (
              <Image
                source={{ uri: editProductImage }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            )}

            <TextInput
              style={styles.formInput}
              placeholder="ชื่อสินค้า"
              placeholderTextColor="#94A3B8"
              value={editProductName}
              onChangeText={setEditProductName}
            />

            <TextInput
              style={styles.formInput}
              placeholder="ความจุ เช่น 20,000 mAh"
              placeholderTextColor="#94A3B8"
              value={editProductCapacity}
              onChangeText={setEditProductCapacity}
            />

            <TextInput
              style={styles.formInput}
              placeholder="ราคา"
              placeholderTextColor="#94A3B8"
              value={editProductPrice}
              onChangeText={setEditProductPrice}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.formInput}
              placeholder="จำนวนสต็อก"
              placeholderTextColor="#94A3B8"
              value={editProductStock}
              onChangeText={setEditProductStock}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={updateProduct}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>บันทึกการแก้ไข</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 54,
    paddingHorizontal: 14,
  },

  // 1. Navbar Top Row
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  brandIcon: {
    fontSize: 24,
  },
  brandTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconButtonEmoji: {
    fontSize: 18,
  },
  cartIconButton: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  navBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  navBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIconEmoji: {
    fontSize: 16,
  },

  // 2. User Banner
  userBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarAdmin: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  userAvatarMember: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  userNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  roleBadgeAdmin: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  roleBadgeAdminText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400E',
  },
  roleBadgeUser: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  roleBadgeUserText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0369A1',
  },
  userIdText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  adminQuickAddBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  adminQuickAddText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // 3. Search Box
  searchBox: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearchText: {
    fontSize: 14,
    color: '#94A3B8',
  },

  // 4. Section Row & Filters
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  productCount: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  layoutToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  layoutToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  layoutToggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  layoutToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  layoutToggleTextActive: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  priceFilterContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  priceFilterButton: {
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priceFilterButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  priceFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  priceFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // 5. Products List / Grid
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },

  // 2-Column Grid Card (บรรทัดละ 2 รายการ)
  cardGrid: {
    width: '48.2%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  imageBoxGrid: {
    width: '100%',
    height: 140,
    backgroundColor: '#F8FAFC',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGrid: {
    width: '82%',
    height: '82%',
  },
  badgeCapacityGrid: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeCapacityTextGrid: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  badgeInStockGrid: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  badgeInStockTextGrid: {
    color: '#15803D',
    fontSize: 9,
    fontWeight: '700',
  },
  badgeOutOfStockGrid: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  badgeOutOfStockTextGrid: {
    color: '#B91C1C',
    fontSize: 9,
    fontWeight: '700',
  },
  productInfoGrid: {
    padding: 10,
  },
  productNameGrid: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  priceGrid: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
  },
  regularPriceGrid: {
    fontSize: 11,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  discountBadgeTextGrid: {
    color: '#DC2626',
    fontSize: 9,
    fontWeight: 'bold',
  },
  detailButtonGrid: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  detailTextGrid: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  adminActionTextGrid: {
    fontSize: 11,
    fontWeight: '700',
  },

  // 1-Column Full Width Card (เต็มจอ)
  cardList: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  imageBoxList: {
    width: '100%',
    height: 195,
    backgroundColor: '#F8FAFC',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageList: {
    width: '85%',
    height: '85%',
  },
  badgeCapacity: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeCapacityText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  badgeInStock: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  badgeInStockText: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '700',
  },
  badgeOutOfStock: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  badgeOutOfStockText: {
    color: '#B91C1C',
    fontSize: 11,
    fontWeight: '700',
  },
  productInfo: {
    padding: 14,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  priceLevelBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priceLevelBadgeText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2563EB',
  },
  regularPrice: {
    fontSize: 14,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountBadgeText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  },
  detailText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  adminActionRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  adminEditButton: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  adminEditButtonText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
  },
  adminDeleteButton: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  adminDeleteButtonText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  adminFooterAddBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  adminFooterAddText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // 6. Empty State
  noResult: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    width: '100%',
  },
  noResultIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  noResultTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  noResultText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  resetFilterBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  resetFilterText: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '600',
  },

  // 7. Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 430,
    maxHeight: '86%',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  modalCloseBtn: {
    position: 'absolute',
    right: 14,
    top: 14,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailImage: {
    width: '100%',
    height: 200,
    marginBottom: 12,
  },
  detailName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  detailBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  detailBadgePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailBadgePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  detailLevelPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  detailLevelPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  detailPriceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  detailPrice: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2563EB',
  },
  detailRegularPrice: {
    fontSize: 15,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  detailStock: {
    color: '#16A34A',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
  },
  detailOutStock: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
  },
  detailDescription: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    textAlign: 'center',
    marginVertical: 14,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
  },
  cartButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  emptyEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  emptyCart: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 10,
  },
  cartImage: {
    width: 60,
    height: 60,
  },
  cartInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  cartItemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 2,
  },
  cartQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  qtyText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: '700',
  },
  deleteCartItemBtn: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
  },
  deleteCartItemText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '700',
  },
  cartTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cartTotalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  cartTotalAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  checkoutButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  checkoutSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 12,
    marginBottom: 8,
  },
  checkoutItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  checkoutItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  checkoutItemDetail: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  checkoutLine: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  checkoutTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkoutTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  checkoutTotalAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2563EB',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  addressInput: {
    height: 65,
    textAlignVertical: 'top',
  },
  paymentContainer: {
    gap: 6,
    marginBottom: 14,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#F8FAFC',
  },
  paymentSelected: {
    borderWidth: 2,
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  paymentText: {
    fontSize: 13,
    color: '#334155',
  },
  paymentTextSelected: {
    color: '#1D4ED8',
    fontWeight: 'bold',
  },
  confirmOrderButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  confirmOrderText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  orderCustomerBox: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  orderCustomerText: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 2,
  },
  orderItemsBox: {
    marginBottom: 8,
  },
  orderItemRow: {
    fontSize: 12,
    color: '#334155',
    marginBottom: 2,
  },
  orderFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 6,
  },
  orderTotalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  orderTotalAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
  },
  statusChangeBtn: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  statusChangeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pickImageBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  pickImageBtnText: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '600',
  },
  previewImage: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 8,
  },
  saveBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
