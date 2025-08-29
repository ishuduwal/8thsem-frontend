export interface IProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  mainImage: string;
  id: string;
}

export interface IOrderItem {
  product: IProduct;
  quantity: number;
  price: number;
  _id: string;
}

export interface IDeliveryAddress {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode?: string;
  _id: string;
}

export interface IUserInfo {
  email: string;
  username: string;
  _id: string;
}

export interface IOrder {
  _id: string;
  userInfo: IUserInfo;
  items: IOrderItem[];
  deliveryAddress: IDeliveryAddress;
  paymentMethod: 'CASH_ON_DELIVERY' | 'ESEWA';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  taxAmount: number;
  deliveryCharge: number;
  grandTotal: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface OrdersResponse {
  orders: IOrder[];
  total: number;
  page: number;
  pages: number;
}

export interface CreateOrderResponse {
  order: IOrder;
  paymentData?: any;
  instructions?: any;
}

export interface CreateOrderData {
  deliveryAddress: {
    fullName: string;
    phoneNumber: string;
    address: string;
    city: string;
    postalCode?: string;
  };
  paymentMethod: 'CASH_ON_DELIVERY' | 'ESEWA';
  notes?: string;
}