import React, { useState, useEffect } from 'react';
import { View, Text, Image, Modal, TextInput, TouchableOpacity, StyleSheet, FlatList,ScrollView} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert } from 'react-native';
import Order from './Order';
import OrderTabs from './Order1';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ProductList" component={ProductList} />
        <Stack.Screen name="Order" component={Order} />
        <Stack.Screen name="Order1" component={OrderTabs} />
      </Stack.Navigator>

    </NavigationContainer>
  );
};

const ProductList = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0); // Thêm totalAmount vào đây
  const [isTopUpModalVisible, setIsTopUpModalVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [updatedNumber, setUpdatedNumber] = useState(0);
  const [orderedItems, setOrderedItems] = useState([]);
 
  const openTopUpModal1 = () => {
    console.log('Open TopUpModal1 Pressed');
    navigation.navigate('Order', { orderedItems: orderedItems });
  };
  const openTopUpModal2 = () => {
    console.log('Open TopUpModal1 Pressed');
    navigation.navigate('Order1', { orderedItems: orderedItems });
  };
  const addToCart = () => {
    
    console.log('Adding to cart:', selectedProduct);
    const totalAmountToSubtract = selectedProduct.price * quantity;
    if (totalAmountToSubtract > totalAmount) {
      // Hiển thị thông báo lỗi nếu số tiền không đủ
      Alert.alert('Lỗi', 'Số tiền của bạn không đủ.');
      return; // Dừng hàm ở đây nếu số tiền không đủ
    }
    if (selectedProduct && quantity > 0 && selectedProduct.number >= quantity) {
      const updatedProduct = { ...selectedProduct, number: selectedProduct.number - quantity };
      setCartItems((prevCartItems) => [...prevCartItems, { ...selectedProduct, quantity }]);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === selectedProduct._id ? updatedProduct : product
        )
      );
      Alert.alert(
        'Thành công',
        'Sản phẩm đã được đặt mua thành công.',
        [{ text: 'OK', onPress: resetQuantityAndNumber }]
      );
      
  // Cập nhật tổng tiền trong ví
  setTotalAmount(totalAmount - totalAmountToSubtract);

      closeProductDetail();
    } else {
      // Hiển thị thông báo khi số lượng mua là 0 hoặc lớn hơn số lượng có sẵn
      const message = quantity === 0
        ? 'Số lượng mua phải lớn hơn 0.'
        : 'Số lượng mua vượt quá số lượng có sẵn.';
      Alert.alert('Lỗi', message);
    }
  };
  
  const resetQuantityAndNumber = () => {
    setQuantity(0);
    setSelectedProduct(null);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      setUpdatedNumber(selectedProduct.number - 1); // Thêm dòng này
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
    setUpdatedNumber(selectedProduct.number + 1); // Thêm dòng này
  };
  

  useEffect(() => {
    // Gửi yêu cầu HTTP để lấy dữ liệu từ API
    axios.get('http://192.168.1.9:3001/list1')
      .then(response => {
        // Xử lý dữ liệu nhận được từ API
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // useEffect sẽ chạy chỉ một lần sau khi component được render

  // Lắng nghe sự kiện thay đổi của searchTerm và reset searchResults khi searchTerm thay đổi
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(products);
    } else {
      // Nếu có giá trị searchTerm, lọc sản phẩm theo điều kiện
      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredProducts);
    }
  }, [searchTerm, products]);

  // Hàm mở modal chi tiết sản phẩm
  const openProductDetail = (product) => {
    setQuantity(0);
    setSelectedProduct(product);
  };

  // Hàm đóng modal chi tiết sản phẩm
  const closeProductDetail = () => {
    setQuantity(0);
    setSelectedProduct(null);
  };


  const openTopUpModal = () => {
    setIsTopUpModalVisible(true);
  };

  const closeTopUpModal = () => {
    setIsTopUpModalVisible(false);
  };

  const handleTopUp = () => {
    if (topUpAmount !== null && topUpAmount >= 0) {
      // Thực hiện nạp tiền và cập nhật tổng tiền trong ví
      const updatedTotalAmount = totalAmount + topUpAmount;
      setTotalAmount(updatedTotalAmount);
      setTopUpAmount(null); // Đặt lại giá trị nhập liệu về null hoặc giá trị mặc định
      closeTopUpModal();
    } else {
      // Hiển thị thông báo lỗi nếu số tiền không hợp lệ
      Alert.alert('Lỗi', 'Số tiền phải lớn hơn hoặc bằng 0.');
    }
  };
  




  return (
    <View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm sản phẩm"
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
        />
        <TouchableOpacity onPress={() => openTopUpModal2(orderedItems)}>
          <Image
            source={require('./assets/don.png')}
            style={styles.cartIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openTopUpModal1(orderedItems)}>
          <Image
            source={require('./assets/gio.png')}
            style={styles.cartIcon}
          />
        </TouchableOpacity>



        <TouchableOpacity onPress={openTopUpModal}>
          <Image
            source={require('./assets/vi1.png')}
            style={styles.cartIcon}
          />
        </TouchableOpacity>

      </View>

      <View style={styles.header}>
        <Text style={styles.headerText}>Product List:</Text>
      </View>
      {/* Hiển thị danh sách sản phẩm */}
      <ScrollView>
        {/* Hiển thị danh sách sản phẩm */}
        {searchResults.map(product => (
          <TouchableOpacity
            key={product._id}
            style={styles.productContainer}
            onPress={() => openProductDetail(product)}
          >
            {/* Hiển thị ảnh */}
            {product.imagePaths.map(imagePath => (
              <Image
                key={imagePath}
                source={{ uri: `http://192.168.1.9:3001/uploads/${imagePath}` }}
                style={styles.image}
              />
            ))}
            {/* Hiển thị các dữ liệu khác */}
            <View style={styles.productInfo}>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.price}>{product.price}$</Text>
              <Text>{product.year}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Modal chi tiết sản phẩm */}
      <Modal
        visible={!!selectedProduct}
        transparent={true}
        onRequestClose={closeProductDetail}
      >
        <View style={styles.modalContainer}>
          {selectedProduct && (
            <>
              <View style={styles.modalContent}>
                <View style={{ flexDirection: 'row' }}>
                  {selectedProduct.imagePaths.map(imagePath => (
                    <Image
                      key={imagePath}
                      source={{ uri: `http://192.168.1.9:3001/uploads/${imagePath}` }}
                      style={styles.modalImage}
                    />
                  ))}
                </View>
                <Text style={styles.modalName}>Tên sản phẩm: {selectedProduct.name}</Text>
                <Text style={styles.modalPrice}>Giá sản phẩm: {selectedProduct.price}$</Text>
                <Text>Số lượng sản phẩm: {selectedProduct.number}</Text>
                <Text style={styles.modalYear}>Năm sản xuất: {selectedProduct.year}</Text>
                <Text>Số lượng mua: </Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                    <Text>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                    <Text>+</Text>
                  </TouchableOpacity>
                </View>


                {/* Nút Thêm vào giỏ hàng */}

                <TouchableOpacity onPress={addToCart} style={styles.addToCartButton}>
                  <Text>Thêm vào giỏ</Text>
                </TouchableOpacity>


              </View>

            </>

          )}

        </View>

      </Modal>


      <Modal
        visible={isTopUpModalVisible}
        transparent={true}
        onRequestClose={closeTopUpModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.topUpModalContent}>
            {/* Ô nhập số tiền */}
            <TextInput
              style={styles.topUpInput}
              placeholder="Nhập số tiền"
              value={topUpAmount !== null ? topUpAmount.toString() : ''}
              onChangeText={text => {
                const numericValue = parseFloat(text);
                setTopUpAmount(isNaN(numericValue) || text.trim() === '' ? null : numericValue);
              }}
            />
            {/* Button Nạp tiền */}
            <TouchableOpacity onPress={handleTopUp} style={styles.topUpButton}>
              <Text style={styles.topUpButtonText}>Nạp tiền</Text>
            </TouchableOpacity>

            {/* Hiển thị Tổng số tiền */}
            <Text style={styles.totalAmountText}>Tổng số tiền của bạn: {totalAmount}$</Text>
          </View>
        </View>
      </Modal>


    </View>

  );
};







const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  name: {
    color: 'orange', // Màu của giá sản phẩm
    fontSize: 17
  },
  price: {
    color: 'green', // Màu của giá sản phẩm
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 30,
    marginLeft: 5,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,

  },
  cartIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain', // Tùy chỉnh theo kích thước và kiểu hiển thị mong muốn
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginStart: 5,
    marginEnd: 5,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
  },
  productInfo: {
    flexDirection: 'column',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {

    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
    height: 350, // Điều chỉnh chiều rộng modal
  },
  modalImage: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  modalName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  modalPrice: {

    marginBottom: 10,
  },
  modalYear: {
    marginTop: 10,
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 50,
  },
  topUpModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
  },
  topUpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  topUpButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  topUpButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  totalAmountText: {
    marginTop: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 5,
  
    marginHorizontal: 3,
    
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
});


export default App;
