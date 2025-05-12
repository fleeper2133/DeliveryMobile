// types/delivery.ts
interface DeliveryFormData {
    tracking_number: string;
    transport: number; // ID транспорта
    transport_number: string;
    packaging_type: number; // ID типа упаковки
    cargo_type?: number; // ID типа груза (опционально)
    weight: string;
    volume?: string; // опционально
    status: number; // ID статуса
    services: number[]; // массив ID услуг
    pickup_address: string;
    delivery_address: string;
    scheduled_pickup?: string; // опционально
    scheduled_delivery?: string; // опционально
    notes?: string; // опционально
    distance_km?: string; // опционально
  }