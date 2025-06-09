import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCategory, getCategoryById, updateCategory, deleteCategory } from '../../services/categoryService';
import { toast } from 'react-toastify';
import type { ICategory } from '../../types/Category';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import axios from 'axios';

interface CategoryFormProps {
  isEdit?: boolean;
}

const CategoryForm = ({ isEdit = false }: CategoryFormProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<ICategory, '_id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const fetchCategory = async () => {
        try {
          setLoading(true);
          const response = await getCategoryById(id);
          setFormData({
            name: response.name,
            description: response.description || '',
          });
        } catch (error) {
          console.error('Error fetching category:', error);
          toast.error('Failed to fetch category');
          navigate('/admin-dashboard/categories');
        } finally {
          setLoading(false);
        }
      };
      fetchCategory();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEdit && id) {
        await updateCategory(id, formData);
        toast.success('Category updated successfully');
      } else {
        await createCategory(formData);
        toast.success('Category created successfully');
      }
      navigate('/admin-dashboard/categories');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message || 'An error occurred');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);
    if (!id) return;
    
    setLoading(true);
    try {
      await deleteCategory(id);
      toast.success('Category deleted successfully');
      navigate('/admin-dashboard/categories');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message || 'Failed to delete category');
      } else {
        toast.error('An unexpected error occurred while deleting category');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEdit ? 'Edit Category' : 'Create New Category'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter category name"
              disabled={loading}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter category description (optional)"
              disabled={loading}
            />
          </div>
          <div className="flex justify-end space-x-3">
            {isEdit && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/admin-dashboard/categories')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEdit ? 'Updating...' : 'Creating...'}
                </span>
              ) : isEdit ? (
                'Update Category'
              ) : (
                'Create Category'
              )}
            </button>
          </div>
        </form>
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Delete Category"
          message="Are you sure you want to delete this category? This action cannot be undone."
          confirmText={loading ? 'Deleting...' : 'Delete'}
          cancelText="Cancel"
          isConfirming={loading}
        />
      </div>
    </div>
  );
};

export default CategoryForm;