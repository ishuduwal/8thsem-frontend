import axios from 'axios';
import API_BASE_URL from "../config/api";
import type { ICategory } from "../types/Category";

// type for the category data
interface CategoryFormData {
  name: string;
  description?: string;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllCategories = async (): Promise<ICategory[]> => {
  try {
    const response = await api.get('/category');
    // we need to access response.data.data to get the actual categories array
    const categories = response.data?.data || response.data;
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

export const getCategoryById = async (id: string): Promise<ICategory> => {
  try {
    const response = await api.get(`/category/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw new Error('Failed to fetch category');
  }
};

export const createCategory = async (categoryData: CategoryFormData): Promise<ICategory> => {
  try {
    const response = await api.post('/category', categoryData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create category');
    }
    throw new Error('Failed to create category');
  }
};

export const updateCategory = async (id: string, categoryData: CategoryFormData): Promise<ICategory> => {
  try {
    const response = await api.put(`/category/${id}`, categoryData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
    throw new Error('Failed to update category');
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await api.delete(`/category/${id}`);
  } catch (error) {
    console.error('Error deleting category:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
    throw new Error('Failed to delete category');
  }
};

// Default export object with all methods
const categoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};

export default categoryService;