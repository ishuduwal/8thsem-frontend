export interface IOrderItem {
  product: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

export interface IDeliveryAddress {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode?: string;
}

export interface IUserInfo {
  email: string;
  username: string;
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
  
  // eSewa specific fields
  esewaTransactionUuid?: string;
  esewaTransactionCode?: string;
  esewaRefId?: string;
  esewaSignature?: string;
  
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}