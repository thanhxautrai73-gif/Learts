import axios from 'axios';

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  description: string;
  originalPrice?: number;
  tag?: string;
}

export interface ProductDetail extends Product {
  categoryName: string;
}

export interface OrderItemInput {
  productId: number;
  quantity: number;
}

export interface OrderInput {
  name: string;
  phone: string;
  email: string;
  address: string;
  items: OrderItemInput[];
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  items: OrderItem[];
  createdAt: string;
}

export interface PaginatedProductsResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  products: Product[];
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Public API Services (unwrapping new standard format)
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<{ success: boolean; message: string; data: Category[] }>('/categories');
  return response.data.data;
};

export interface GetProductsParams {
  categoryId?: number;
  sort?: string;
  page?: number;
  limit?: number;
  q?: string;
  featured?: boolean;
}

export const getProducts = async (params: GetProductsParams = {}): Promise<PaginatedProductsResponse> => {
  const response = await api.get<{ success: boolean; message: string; data: PaginatedProductsResponse }>('/products', { params });
  return response.data.data;
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const response = await api.get<{ success: boolean; message: string; data: Product[] }>('/products', { params: { featured: true } });
  return response.data.data;
};

export const getProductDetail = async (id: number): Promise<ProductDetail> => {
  const response = await api.get<{ success: boolean; message: string; data: ProductDetail }>(`/products/${id}`);
  return response.data.data;
};

export const createOrder = async (orderData: OrderInput): Promise<{ message: string; orderId: number; totalAmount: number }> => {
  const response = await api.post<{ success: boolean; message: string; data: { orderId: number; totalAmount: number } }>('/orders', orderData);
  return {
    message: response.data.message,
    orderId: response.data.data.orderId,
    totalAmount: response.data.data.totalAmount,
  };
};

// Admin Auth Services
export const adminRegister = async (username: string, email: string, password: string): Promise<{ message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>('/auth/register', {
    username,
    email,
    password,
  });
  return response.data;
};

export const adminLogin = async (usernameOrEmail: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<{ success: boolean; message: string; data: AuthResponse }>('/auth/login', {
    usernameOrEmail,
    password,
  });
  return response.data.data;
};

// Admin Product Services (Protected)
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  const response = await api.post<{ success: boolean; message: string; data: Product }>('/products', productData);
  return response.data.data;
};

export const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product> => {
  const response = await api.put<{ success: boolean; message: string; data: Product }>(`/products/${id}`, productData);
  return response.data.data;
};

export const deleteProduct = async (id: number): Promise<Product> => {
  const response = await api.delete<{ success: boolean; message: string; data: Product }>(`/products/${id}`);
  return response.data.data;
};

// Admin Order Services (Protected)
export const getAdminOrders = async (): Promise<Order[]> => {
  const response = await api.get<{ success: boolean; message: string; data: Order[] }>('/orders');
  return response.data.data;
};

export const updateOrderStatus = async (id: number, status: string): Promise<Order> => {
  const response = await api.put<{ success: boolean; message: string; data: Order }>(`/orders/${id}/status`, { status });
  return response.data.data;
};

// Admin User Management Services (Protected)
export interface AdminUserListItem {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

export const getAdminUsers = async (): Promise<AdminUserListItem[]> => {
  const response = await api.get<{ success: boolean; message: string; data: AdminUserListItem[] }>('/users');
  return response.data.data;
};

export const deleteAdminUser = async (id: string): Promise<{ id: string; username: string }> => {
  const response = await api.delete<{ success: boolean; message: string; data: { id: string; username: string } }>(`/users/${id}`);
  return response.data.data;
};

export default api;
