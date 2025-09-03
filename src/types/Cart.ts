export interface ICartItem {
  product: string; // Product ID
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface ICart {
  _id?: string;
  userId: string; // User ID
  items: ICartItem[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}