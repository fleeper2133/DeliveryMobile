import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform, Pressable } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDeliveryDetails, updateDeliveryStore, getDeliveries } from '@/store/deliveriesSlice';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getPackingTypes } from '@/store/packingTypeSlice';
import { getTransports } from '@/store/transportSlice';
import { getStatuses } from '@/store/statuseSlice';
import { getServices } from '@/store/serviceSlice';
import { getTypeCargo } from '@/store/typeCargoSlice';

const EditDeliveryScreen = ({ route, navigation }) => {
  const { deliveryId } = route.params;
  const dispatch = useAppDispatch();
  const { delivery, transports, packagingTypes, statuses, services } = useAppSelector(state => ({
    delivery: state.deliveries.items.find(d => d.id === deliveryId),
    transports: state.transports.items,
    packagingTypes: state.packingTypes.items,
    statuses: state.statuses.items,
    services: state.services.items,
  }));

  const [formData, setFormData] = useState({
    tracking_number: '',
    transport_id: '',
    transport_number: '',
    packaging_type_id: '',
    weight: '',
    volume: '',
    status_id: '',
    services_ids: [],
    pickup_address: '',
    delivery_address: '',
    scheduled_pickup: '',
    scheduled_delivery: '',
    notes: '',
    distance_km: ''
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState('');
  const [selectedServices, setSelectedServices] = useState({});

  useEffect(() => {
    dispatch(fetchDeliveryDetails(deliveryId));
    dispatch(getPackingTypes());
        dispatch(getTransports());
        dispatch(getStatuses());
        dispatch(getServices());
        dispatch(getTypeCargo());
  }, [dispatch, deliveryId]);

  useEffect(() => {
    if (delivery) {
      setFormData({
        tracking_number: delivery.tracking_number,
        transport_id: delivery.transport?.id || '',
        transport_number: delivery.transport_number,
        packaging_type_id: delivery.packaging_type?.id || '',
        weight: delivery.weight.toString(),
        volume: delivery.volume?.toString() || '',
        status_id: delivery.status?.id || '',
        services_ids: delivery.services?.map(s => s.id) || [],
        pickup_address: delivery.pickup_address,
        delivery_address: delivery.delivery_address,
        scheduled_pickup: delivery.scheduled_pickup || '',
        scheduled_delivery: delivery.scheduled_delivery || '',
        notes: delivery.notes || '',
        distance_km: delivery.distance_km?.toString() || ''
      });

      // Инициализируем выбранные услуги
      const initialServices = {};
      delivery.services?.forEach(service => {
        initialServices[service.id] = true;
      });
      setSelectedServices(initialServices);
    }
  }, [delivery]);

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
    
    setFormData(prev => {
      const services = prev.services_ids.includes(serviceId)
        ? prev.services_ids.filter(id => id !== serviceId)
        : [...prev.services_ids, serviceId];
      return { ...prev, services_ids: services };
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({
        ...formData,
        [dateField]: selectedDate.toISOString(),
      });
    }
  };

  const openDatePicker = (field) => {
    setDateField(field);
    setShowDatePicker(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не выбрано';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleSubmit = async () => {
    try {
      const updatedData = {
        id: deliveryId,
        data: {
          ...formData,
          weight: parseFloat(formData.weight),
          volume: formData.volume ? parseFloat(formData.volume) : null,
          distance_km: formData.distance_km ? parseFloat(formData.distance_km) : null,
        }
      };
      await dispatch(updateDeliveryStore(updatedData as any));
      console.log('Доставка успешно обновлена');
      await dispatch(getDeliveries());
      navigation.goBack();
    } catch (error) {
      console.error('Ошибка при обновлении:', error);
    }
  };  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Редактирование доставки</Text>

      {/* Основная информация */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Основная информация</Text>
        
        <Text style={styles.label}>Трек-номер*</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#9E9E9E"
          value={formData.tracking_number}
          onChangeText={text => setFormData({...formData, tracking_number: text})}
          placeholder="Введите трек-номер"
        />

        <Text style={styles.label}>Модель транспорта*</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.transport_id}
            dropdownIconColor="#BB86FC"
            style={styles.picker}
            onValueChange={itemValue => setFormData({...formData, transport_id: itemValue})}>
            {transports.map(transport => (
              <Picker.Item 
                key={transport.id} 
                label={transport.name} 
                value={transport.id} 
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Номер транспорта*</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#9E9E9E"
          value={formData.transport_number}
          onChangeText={text => setFormData({...formData, transport_number: text})}
          placeholder="Например: A123BC"
        />
      </View>

      {/* Характеристики груза */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Характеристики груза</Text>
        
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Вес (кг)*</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#9E9E9E"
              value={formData.weight}
              onChangeText={text => setFormData({...formData, weight: text})}
              keyboardType="numeric"
              placeholder="0.00"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Объем (м³)</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#9E9E9E"
              value={formData.volume}
              onChangeText={text => setFormData({...formData, volume: text})}
              keyboardType="numeric"
              placeholder="0.000"
            />
          </View>
        </View>

        <Text style={styles.label}>Тип упаковки*</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.packaging_type_id}
            dropdownIconColor="#BB86FC"
            style={styles.picker}
            onValueChange={itemValue => setFormData({...formData, packaging_type_id: itemValue})}>
            {packagingTypes.map(type => (
              <Picker.Item key={type.id} label={type.name} value={type.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Статус*</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.status_id}
            dropdownIconColor="#BB86FC"
            style={styles.picker}
            onValueChange={itemValue => setFormData({...formData, status_id: itemValue})}>
            {statuses.map(status => (
              <Picker.Item key={status.id} label={status.name} value={status.id} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Адреса */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Адреса</Text>
        
        <Text style={styles.label}>Адрес забора*</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholderTextColor="#9E9E9E"
          value={formData.pickup_address}
          onChangeText={text => setFormData({...formData, pickup_address: text})}
          placeholder="Полный адрес"
          multiline
        />

        <Text style={styles.label}>Адрес доставки*</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholderTextColor="#9E9E9E"
          value={formData.delivery_address}
          onChangeText={text => setFormData({...formData, delivery_address: text})}
          placeholder="Полный адрес"
          multiline
        />

        <Text style={styles.label}>Расстояние (км)</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#9E9E9E"
          value={formData.distance_km}
          onChangeText={text => setFormData({...formData, distance_km: text})}
          keyboardType="numeric"
          placeholder="0.00"
        />
      </View>

      {/* Время и дата */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Время и дата</Text>
        
        <TouchableOpacity 
          style={styles.dateInput} 
          onPress={() => openDatePicker('scheduled_pickup')}>
          <Text style={styles.dateText}>
            {formatDate(formData.scheduled_pickup) || 'Запланированный забор'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.dateInput} 
          onPress={() => openDatePicker('scheduled_delivery')}>
          <Text style={styles.dateText}>
            {formatDate(formData.scheduled_delivery) || 'Запланированная доставка'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Услуги */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Дополнительные услуги</Text>
        
        {services.map(service => (
             <Pressable key={service.id} 
                           style={{
                             flexDirection: 'row',
                             alignItems: 'center',
                             marginVertical: 8,
                           }}
                           onPress={() => handleServiceToggle(service.id)}>
                           <View style={[
                             {
                               width: 24,
                               height: 24,
                               borderRadius: 4,
                               borderWidth: 2,
                               borderColor: '#FFFFFF',
                               justifyContent: 'center',
                               alignItems: 'center',
                               marginRight: 12,
                             },
                             selectedServices[service.id] && {
                               backgroundColor: '#FFFFFF',
                             }
                           ]}>
                             {selectedServices[service.id] && <Text style={{color: '#121212'}}>✓</Text>}
                           </View>
                           <Text style={{
                             color: '#FFFFFF',
                             fontSize: 16,
                           }}>
                             {service.name} (+{service.price} ₽)
                           </Text>
                         </Pressable>

          
        ))}
      </View>

      {/* Примечания */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Примечания</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholderTextColor="#9E9E9E"
          value={formData.notes}
          onChangeText={text => setFormData({...formData, notes: text})}
          placeholder="Дополнительная информация"
          multiline
        />
      </View>

      {/* Кнопка сохранения */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Сохранить изменения</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(formData[dateField] || new Date())}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          textColor="#FFFFFF"
          themeVariant="dark"
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    color: '#BB86FC',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  label: {
    color: '#E0E0E0',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2D2D2D',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3700B3',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#2D2D2D',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3700B3',
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
    height: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    width: '48%',
  },
  dateInput: {
    backgroundColor: '#2D2D2D',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3700B3',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceText: {
    color: '#FFFFFF',
    marginLeft: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#BB86FC',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditDeliveryScreen;