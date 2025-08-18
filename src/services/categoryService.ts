import axios from 'axios';
import API_BASE_URL from "../config/api";
import type { ICategory} from "../types/Category";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const getAllCategories = async (): Promise<ICategory[]> => {
  try {
    const response = await api.get('/categories');
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

export const getCategoryById = async (id: string): Promise<ICategory> => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw new Error('Failed to fetch category');
  }
};

export const createCategory = async (formData: FormData): Promise<ICategory> => {
  try {
    const response = await api.post('/categories', formData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error('Failed to create category');
  }
};

export const updateCategory = async (id: string, formData: FormData): Promise<ICategory> => {
  try {
    const response = await api.put(`/categories/${id}`, formData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await api.delete(`/categories/${id}`);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
};