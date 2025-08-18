import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { 
  createCategory, 
  getCategoryById, 
  updateCategory,
  deleteCategory 
} from '../../services/categoryService';
import { toast } from 'react-toastify';
import type { ICategory, CategoryFormValues } from '../../types/Category';
import { ConfirmationModal } from '../../components/ConfirmationModal';

interface CategoryFormProps {
  isEdit?: boolean;
}

const CategoryForm = ({ isEdit = false }: CategoryFormProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<CategoryFormValues>({
    name: '',
    description: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const fetchCategory = async () => {
        try {
          setIsLoading(true);
          const category: ICategory = await getCategoryById(id);
          setFormValues({
            name: category.name,
            description: category.description || '',
            image: null
          });
          if (category.image) {
            setPreviewImage(category.image);
          }
        } catch (error) {
          console.error('Error fetching category:', error);
          toast.error('Failed to fetch category');
          navigate('/admin-dashboard/categories');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCategory();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormValues(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormValues(prev => ({ ...prev, image: null }));
    setPreviewImage(null);
  };

  const validateForm = () => {
    const newErrors: { name?: string } = {};
    if (!formValues.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareFormData = (): FormData => {
    const formData = new FormData();
    formData.append('name', formValues.name);
    if (formValues.description) {
      formData.append('description', formValues.description);
    }
    if (formValues.image) {
      formData.append('image', formValues.image);
    }
    return formData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formData = prepareFormData();

      if (isEdit && id) {
        await updateCategory(id, formData);
        toast.success('Category updated successfully');
      } else {
        await createCategory(formData);
        toast.success('Category created successfully');
      }
      navigate('/admin-dashboard/categories');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while saving the category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      await deleteCategory(id);
      toast.success('Category deleted successfully');
      navigate('/admin-dashboard/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-sm shadow-sm">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        {isEdit ? (
          <>
            <Edit className="w-5 h-5 mr-2" />
            Edit Category
          </>
        ) : (
          <>
            <Plus className="w-5 h-5 mr-2" />
            Create New Category
          </>
        )}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
            disabled={isLoading}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formValues.description || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Image
          </label>
          {previewImage ? (
            <div className="relative w-40 h-40 mb-2">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-full h-full object-cover rounded-sm border border-gray-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-sm bg-gray-50">
              <ImageIcon className="w-10 h-10 text-gray-400" />
            </div>
          )}
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {isEdit && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 flex items-center disabled:opacity-70"
              disabled={isLoading}
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/admin-dashboard/categories')}
            className="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 flex items-center disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
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
        confirmText={isLoading ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        isConfirming={isLoading}
        type="danger"
      />
    </div>
  );
};

export default CategoryForm;