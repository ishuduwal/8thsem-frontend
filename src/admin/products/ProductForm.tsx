import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader2, X, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { getAllCategories } from '../../services/categoryService';
import type { ICategory } from '../../types/Category';
import productService from '../../services/productService';

interface ProductFormProps {
  isEdit?: boolean;
}

interface FormValues {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  mainImage: File | null;
  additionalImages: File[];
}

interface PreviewImages {
  mainImage: string;
  additionalImages: string[];
}

const ProductForm = ({ isEdit = false }: ProductFormProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    mainImage: null,
    additionalImages: [],
  });
  const [previewImages, setPreviewImages] = useState<PreviewImages>({
    mainImage: '',
    additionalImages: [],
  });
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getAllCategories();
        setCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();

    if (isEdit && id) {
      const fetchProduct = async () => {
        try {
          setIsLoading(true);
          const response = await productService.getProductById(id);
          const product = response.data;

          // Ensure required fields exist
          if (!product || !product.name || product.price === undefined) {
            throw new Error('Product data is incomplete');
          }

          setFormValues({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            stock: product.stock?.toString() || '',
            category: typeof product.category === 'object'
              ? product.category._id
              : product.category || '',
            mainImage: null,
            additionalImages: [],
          });

          setPreviewImages({
            mainImage: product.mainImage || '',
            additionalImages: product.subImages || [],
          });
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error('Failed to fetch product');
          navigate('/admin-dashboard/products');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormValues(prev => ({ ...prev, mainImage: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => ({ ...prev, mainImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Check if adding these files would exceed the limit
      const currentCount = formValues.additionalImages.length;
      const newFiles = files.slice(0, 3 - currentCount); 

      if (newFiles.length === 0) {
        toast.error('You can only upload up to 3 additional images');
        return;
      }

      // Append new files to existing ones
      const updatedFiles = [...formValues.additionalImages, ...newFiles];
      setFormValues(prev => ({ ...prev, additionalImages: updatedFiles }));

      // Create previews for new files only
      const newPreviewImages: string[] = [];
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviewImages.push(reader.result as string);
          if (newPreviewImages.length === newFiles.length) {
            setPreviewImages(prev => ({
              ...prev,
              additionalImages: [...prev.additionalImages, ...newPreviewImages],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMainImage = () => {
    setFormValues(prev => ({ ...prev, mainImage: null }));
    setPreviewImages(prev => ({ ...prev, mainImage: '' }));
  };

  const removeAdditionalImage = (index: number) => {
    const newAdditionalImages = [...formValues.additionalImages];
    newAdditionalImages.splice(index, 1);
    setFormValues(prev => ({ ...prev, additionalImages: newAdditionalImages }));

    const newPreviewImages = [...previewImages.additionalImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(prev => ({ ...prev, additionalImages: newPreviewImages }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formValues.name.trim()) newErrors.name = 'Product name is required';
    if (!formValues.description.trim()) newErrors.description = 'Description is required';
    if (!formValues.price) newErrors.price = 'Price is required';
    if (isNaN(Number(formValues.price)) || Number(formValues.price) <= 0)
      newErrors.price = 'Price must be a positive number';
    if (!formValues.category) newErrors.category = 'Category is required';
    if (!isEdit && !formValues.mainImage) newErrors.mainImage = 'Main image is required';
    if (isNaN(Number(formValues.stock)) || Number(formValues.stock) < 0)
      newErrors.stock = 'Stock must be a non-negative number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareFormData = () => {
    const formData = new FormData();
    formData.append('name', formValues.name);
    formData.append('description', formValues.description);
    formData.append('price', formValues.price);
    formData.append('category', formValues.category);

    formData.append('stock', formValues.stock || '0');

    if (formValues.mainImage) {
      formData.append('mainImage', formValues.mainImage);
    }

    formValues.additionalImages.forEach((file) => {
      formData.append('subImages', file);
    });

    return formData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formData = prepareFormData();

      if (isEdit && id) {
        await productService.updateProduct(id, formData);
        toast.success('Product updated successfully');
      } else {
        await productService.createProduct(formData);
        toast.success('Product created successfully');
      }
      navigate('/admin-dashboard/products');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while saving the product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      navigate('/admin-dashboard/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="bg-white">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        {isEdit ? (
          <>
            <Edit className="w-5 h-5 mr-2" />
            Edit Product
          </>
        ) : (
          <>
            <Plus className="w-5 h-5 mr-2" />
            Create New Product
          </>
        )}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
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
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formValues.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none pr-8`}
                disabled={isLoading || categories.length === 0}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formValues.price}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
              disabled={isLoading}
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formValues.stock}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            rows={7}
            className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
            disabled={isLoading}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Image <span className="text-red-500">*</span>
            </label>
            {previewImages.mainImage ? (
              <div className="relative w-full h-48 mb-2">
                <img
                  src={previewImages.mainImage}
                  alt="Main preview"
                  className="w-full h-full object-contain rounded-sm border border-gray-200 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-sm bg-gray-50">
                <ImageIcon className="w-10 h-10 text-gray-400" />
              </div>
            )}
            <input
              type="file"
              id="mainImage"
              name="mainImage"
              onChange={handleMainImageChange}
              accept="image/*"
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={isLoading}
            />
            {errors.mainImage && <p className="mt-1 text-sm text-red-500">{errors.mainImage}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Images (optional)
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {previewImages.additionalImages.map((image, index) => (
                <div key={index} className="relative h-24">
                  <img
                    src={image}
                    alt={`Additional ${index}`}
                    className="w-full h-full object-cover rounded-sm border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute top-0 right-0 bg-white rounded-full p-0.5 shadow-sm hover:bg-gray-100"
                  >
                    <X className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              ))}
              {previewImages.additionalImages.length < 6 && (
                <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-sm bg-gray-50">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <input
              type="file"
              id="additionalImages"
              name="additionalImages"
              onChange={handleAdditionalImagesChange}
              accept="image/*"
              multiple
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={isLoading || previewImages.additionalImages.length >= 3}
            />
            <p className="mt-1 text-xs text-gray-500">You can upload up to 3 additional images</p>
          </div>
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
            onClick={() => navigate('/admin-dashboard/products')}
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
              'Update Product'
            ) : (
              'Create Product'
            )}
          </button>
        </div>
      </form>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText={isLoading ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        isConfirming={isLoading}
        type="danger"
      />
    </div>
  );
};

export default ProductForm;