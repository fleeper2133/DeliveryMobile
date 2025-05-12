// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import deliveriesReducer from './deliveriesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuth } from './authSlice';
import transportReducer from './transportSlice';
import statusReducerr from './statuseSlice';
import servecesReducer from './serviceSlice';
import packingTypeReducer from './packingTypeSlice';
import typeCargoReducer from './typeCargoSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    deliveries: deliveriesReducer,
    transports: transportReducer,
    statuses: statusReducerr,
    services: servecesReducer,
    packingTypes: packingTypeReducer,
    typeCargos: typeCargoReducer,
  },
});

// Проверка авторизации при запуске
(async () => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    store.dispatch(setAuth(true));
  }
})();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;