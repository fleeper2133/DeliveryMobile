import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import DeliveryListScreen from '../screens/DeliveryListScreen';
import NewDeliveryScreen from '../screens/NewDeliveryScreen';
import EditDeliveryScreen from '../screens/EditDeliveryScreen';
import ProfileScreen from '../screens/Profile';

const Tab = createBottomTabNavigator();
const DeliveryStack = createStackNavigator();

// Создаем Stack Navigator для экранов доставки
function DeliveryStackScreen() {
  return (
    <DeliveryStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E1E1E',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: '#121212'
        }
      }}
    >
      <DeliveryStack.Screen 
        name="DeliveryList" 
        component={DeliveryListScreen} 
        options={{ headerShown: false }} // Скрываем заголовок для основного экрана
      />
      <DeliveryStack.Screen 
        name="EditDelivery" 
        component={EditDeliveryScreen}
        options={{ title: 'Редактирование доставки' }}
      />
      <DeliveryStack.Screen
        name="NewDelivery"
        component={NewDeliveryScreen}
        options={{ title: 'Новая доставка' }}
      />
    </DeliveryStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#BB86FC',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#1E1E1E',
          borderTopColor: '#121212',
        },
      }}
    >
      <Tab.Screen 
        name="Доставки" 
        component={DeliveryStackScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Профиль" 
        component={ProfileScreen} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}