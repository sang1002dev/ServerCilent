import React from 'react';
import { View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const Order1 = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Đang xử lý">
        {() => <OrderListScreen status="Đang xử lý" />}
      </Tab.Screen>
      <Tab.Screen name="Đang giao">
        {() => <OrderListScreen status="Đang giao" />}
      </Tab.Screen>
      <Tab.Screen name="Đã giao">
        {() => <OrderListScreen status="Đã giao" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const OrderListScreen = ({ status }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{`Danh sách đơn hàng - ${status}`}</Text>
    </View>
  );
};

export default Order1;
