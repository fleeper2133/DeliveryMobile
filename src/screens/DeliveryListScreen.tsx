import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import DeliveryDetailsModal from '../components/DeliveryDetailsModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { completeDeliveryStore, getDeliveries } from '@/store/deliveriesSlice';
import { Icon } from 'react-native-paper';

const DeliveryListScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const deliveries = useAppSelector(state => state.deliveries.items);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCardPress = (delivery) => {
    setSelectedDelivery(delivery);
    setModalVisible(true);
  };

  useEffect(() => {
    // Загрузка данных при монтировании компонента
    dispatch(getDeliveries())
  }, [dispatch]);
  

  const handleComplete = async () => {
    try {
      await dispatch(completeDeliveryStore(selectedDelivery.id)).unwrap();
      setModalVisible(false);
    } catch (error) {
      console.error('Ошибка при проведении доставки:', error);
    }
  };

  const handleEdit = () => {
    setModalVisible(false);
    navigation.navigate('EditDelivery', { deliveryId: selectedDelivery.id });
  };

  const handleAddPress = () => {
    navigation.navigate('NewDelivery');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Доставки</Text>
        </View>
   
      <FlatList
        data={deliveries}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => handleCardPress(item)}
          >
            <Text style={styles.trackingNumber}>№{item.tracking_number}</Text>
            <Text style={styles.status}>{item.status.name}</Text>
            
      
            {/* Остальные поля */}
            <View style={styles.row}>
              <Text style={styles.label}>ID:</Text>
              <Text style={styles.value}>{item.id}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>Адрес доставки:</Text>
              <Text style={styles.value}>{item.delivery_address}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>Упаковка:</Text>
              <Text style={styles.value}>{item.packaging_type?.name || 'Не указана'}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
      />

       <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddPress}
        >
          <Text style={styles.value}>+</Text>
        </TouchableOpacity>

      {selectedDelivery && (
        <DeliveryDetailsModal
          delivery={selectedDelivery}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onEdit={handleEdit}
          onComplete={handleComplete}
        />
      )}
    </View>
     </SafeAreaView>
  );
};

const styles = StyleSheet.create({
   safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  card: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#BB86FC',
  },
  trackingNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  status: {
    color: '#03DAC6',
    fontSize: 14,
  },

  id: { fontWeight: 'bold', color: '#BB86FC' },
  label: {
      color: '#BB86FC', // Фиолетовый для меток
      fontSize: 14,
    },
    value: {
      color: '#FFFFFF', // Белый для значений
      fontSize: 14,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 4,
    },

    errorText: {
      color: '#CF6679', // Красный для ошибок
    },
    addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#BB86FC',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default DeliveryListScreen;