// screens/CreateDeliveryScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createDeliveryStore, getDeliveries } from '@/store/deliveriesSlice';
import { getPackingTypes } from '@/store/packingTypeSlice';
import { getTransports } from '@/store/transportSlice';
import { getStatuses } from '@/store/statuseSlice';
import { getServices } from '@/store/serviceSlice';
import { getTypeCargo } from '@/store/typeCargoSlice';
import DateTimePickerField from '@/components/DateTimePickerField';
import { Pressable } from 'react-native';

const CreateDeliveryScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { 
    transports, 
    packingTypes, 
    statuses, 
    services,
    typeCargos
  } = useAppSelector(state => ({
    transports: state.transports.items,
    packingTypes: state.packingTypes.items,
    statuses: state.statuses.items,
    services: state.services.items,
    typeCargos: state.typeCargos.items
  }));

  const [formData, setFormData] = useState({
    tracking_number: '',
    transport_id: transports[0]?.id || '',
    transport_number: '',
    packaging_type_id: packingTypes[0]?.id || '',
    cargo_type: typeCargos[0]?.id || '',
    weight: '',
    volume: '',
    status_id: statuses.find(s => s.code === 'PENDING')?.id || '',
    services_ids: [],
    pickup_address: '',
    delivery_address: '',
    scheduled_pickup: '',
    scheduled_delivery: '',
    notes: '',
    distance_km: ''
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState('');
  const [selectedServices, setSelectedServices] = useState({});

  useEffect(() => {
    dispatch(getPackingTypes());
    dispatch(getTransports());
    dispatch(getStatuses());
    dispatch(getServices());
    dispatch(getTypeCargo());
  }, [dispatch]);

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
    
    setFormData(prev => {
      const services = prev.services_ids.includes(serviceId)
        ? prev.services_ids.filter(id => id !== serviceId)
        : [...prev.services_ids, serviceId];
      return { ...prev, service_ids: services };
    });
  };


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const deliveryData = {
        ...formData,
        weight: parseFloat(formData.weight),
        volume: formData.volume ? parseFloat(formData.volume) : null,
        distance_km: formData.distance_km ? parseFloat(formData.distance_km) : null,
        status_id: statuses.find(s => s.code === 'PENDING')?.id || '',
      };
      console.log('Delivery Data:', deliveryData);
      await dispatch(createDeliveryStore(deliveryData as any)).unwrap();
      await dispatch(getDeliveries());
      navigation.goBack();
    } catch (error) {
      console.error('Error creating delivery:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Новая доставка</Text>

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
            {packingTypes.map(type => (
              <Picker.Item key={type.id} label={type.name} value={type.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Тип груза</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.cargo_type}
            dropdownIconColor="#BB86FC"
            style={styles.picker}
            onValueChange={itemValue => setFormData({...formData, cargo_type: itemValue})}>
            {typeCargos.map(type => (
              <Picker.Item key={type.id} label={type.name} value={type.id} />
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
        
        <DateTimePickerField
  value={formData.scheduled_pickup ? new Date(formData.scheduled_pickup) : null}
  onChange={(date) => setFormData({...formData, scheduled_pickup: date.toISOString()})}
  placeholder="Запланированный забор"
/>


<DateTimePickerField
  value={formData.scheduled_delivery ? new Date(formData.scheduled_delivery) : null}
  onChange={(date) => setFormData({...formData, scheduled_delivery: date.toISOString()})}
  placeholder="Запланированная доставка"
/>
      </View>

      {/* Услуги */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Дополнительные услуги</Text>
        
        {services.map(service => (
          <View key={service.id} style={styles.serviceItem}>
            <Pressable 
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


          </View>
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

      {/* Кнопка создания */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (loading || !formData.tracking_number || !formData.transport_number || !formData.weight) && 
            styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={loading || !formData.tracking_number || !formData.transport_number || !formData.weight}>
        <Text style={styles.submitButtonText}>
          {loading ? 'Создание...' : 'Создать доставку'}
        </Text>
      </TouchableOpacity>

     
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
  submitButtonDisabled: {
    backgroundColor: '#555555',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateDeliveryScreen;