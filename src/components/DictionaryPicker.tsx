import { Picker } from "@react-native-picker/picker";

const DictionaryPicker = ({ items, selectedValue, onSelect }) => {
    return (
      <Picker
        selectedValue={selectedValue}
        onValueChange={onSelect}
        style={styles.picker}
        itemStyle={styles.pickerItem}
      >
        {items.map(item => (
          <Picker.Item 
            key={item.id} 
            label={item.name} 
            value={item.id} 
          />
        ))}
      </Picker>
    );
  };