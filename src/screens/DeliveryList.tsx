import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { getDeliveries } from '@/store/deliveriesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuth, logout } from '@/store/authSlice';
import { useNavigation } from '@react-navigation/native';

interface DeliveryItem {
  id: number;
  tracking_number: string;
  status: { name: string };  // Предполагая, что status - это объект с полем name
  pickup_address: string;
  delivery_address: string;
  customer: { username: string };
  created_at: string;
  total_price: number;
}

const [filters, setFilters] = useState({
  status: '',
  dateFrom: '',
  dateTo: ''
});

const filteredDeliveries = useMemo(() => {
  return deliveries.filter(delivery => {
    // Примените фильтры
    return true;
  });
}, [deliveries, filters]);

const DeliveryList = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { items, loading, error } = useAppSelector((state) => state.deliveries);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('access_token');
      dispatch(setAuth(!!token));
      
      if (token) {
        dispatch(getDeliveries());
      } else {
        navigation.navigate('Login');
      }
    };
    
    checkAuth();
  }, [dispatch, navigation]);

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Redirecting to login...</Text>
      </View>
    );
  }

  if (loading) {
    return <View style={styles.container}>
    <ActivityIndicator size="large" />
  </View>;
  }

  if (error) {
    return  <View style={styles.container}>
    <Text style={styles.error}>Error: {error}</Text>
    <Button 
      title="Retry" 
      onPress={() => dispatch(getDeliveries())} 
    />
  </View>;
  }

  const renderItem = ({ item }: { item: DeliveryItem }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>№ {item.tracking_number}</Text>
      <Text style={styles.customer}>Клиент: {item.customer.username}</Text>
      
      <View style={styles.addressContainer}>
        <Text style={styles.addressLabel}>Откуда:</Text>
        <Text style={styles.addressText}>{item.pickup_address}</Text>
      </View>
      
      <View style={styles.addressContainer}>
        <Text style={styles.addressLabel}>Куда:</Text>
        <Text style={styles.addressText}>{item.delivery_address}</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={[
          styles.status,
          item.status.name === 'delivered' && styles.delivered,
          item.status.name === 'pending' && styles.pending
        ]}>
          {item.status.name}
        </Text>
        <Text style={styles.price}>{item.total_price} ₽</Text>
      </View>
      
      <Text style={styles.date}>
        Создано: {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  listContainer: {
    padding: 8,
  },
  itemContainer: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  customer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  addressContainer: {
    marginBottom: 6,
  },
  addressLabel: {
    fontWeight: '500',
    fontSize: 14,
  },
  addressText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  delivered: {
    color: 'green',
  },
  pending: {
    color: 'orange',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});

export default DeliveryList;