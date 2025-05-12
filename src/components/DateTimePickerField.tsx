import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const DateTimePickerField = ({ value, onChange, placeholder }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.dismiss('date');
    } else {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setTempDate(selectedDate);
      if (Platform.OS === 'ios') {
        setShowTimePicker(true);
      }
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.dismiss('time');
    } else {
      setShowTimePicker(false);
    }

    if (selectedTime) {
      const newDate = new Date(tempDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      onChange(newDate);
    }
  };

  const showAndroidDatePicker = () => {
    DateTimePickerAndroid.open({
      value: value || new Date(),
      mode: 'date',
      display: 'default',
      onChange: (event, date) => {
        if (event.type !== 'dismissed') {
          setTempDate(date);
          showAndroidTimePicker();
        }
      },
    });
  };

  const showAndroidTimePicker = () => {
    DateTimePickerAndroid.open({
      value: tempDate,
      mode: 'time',
      display: 'default',
      onChange: (event, time) => {
        if (event.type !== 'dismissed') {
          const newDate = new Date(tempDate);
          newDate.setHours(time.getHours());
          newDate.setMinutes(time.getMinutes());
          onChange(newDate);
        }
      },
    });
  };

  const handlePress = () => {
    if (Platform.OS === 'android') {
      showAndroidDatePicker();
    } else {
      setShowDatePicker(true);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        <Text style={styles.text}>
          {value ? value.toLocaleString() : placeholder}
        </Text>
      </TouchableOpacity>

      {showDatePicker && Platform.OS === 'ios' && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          themeVariant="dark"
        />
      )}

      {showTimePicker && Platform.OS === 'ios' && (
        <DateTimePicker
          value={tempDate}
          mode="time"
          display="spinner"
          onChange={handleTimeChange}
          themeVariant="dark"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2D2D2D',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3700B3',
    marginBottom: 16,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default DateTimePickerField;