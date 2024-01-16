import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Order = ({ route }) => {
    const { orderedItems } = route.params;

  const navigation = useNavigation();
  // Tính tổng tiền
  const totalAmount = orderedItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Hàm xử lý khi nhấn nút Đặt mua
  const handleOrder = () => {
    // Thực hiện xử lý đặt hàng ở đây
    // Có thể gọi API đặt hàng hoặc thực hiện các bước cần thiết

    // Sau khi đặt hàng thành công, có thể chuyển về màn hình ProductList hoặc màn hình khác
    navigation.navigate('ProductList');
  };

  return (
    <View style={styles.container}>
      {/* Hiển thị danh sách sản phẩm đã đặt mua */}
      <FlatList
        data={orderedItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text>{item.name}</Text>
            <Text>{item.price}$ x {item.quantity}</Text>
          </View>
        )}
      />

      {/* Hiển thị tổng tiền */}
      <Text style={styles.totalAmount}>Tổng tiền: {totalAmount}$</Text>

      {/* Nút Đặt mua */}
      <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
        <Text>Đặt mua</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  orderButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
});

export default Order;
