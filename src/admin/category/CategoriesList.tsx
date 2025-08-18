import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Loader2 
} from 'lucide-react';
import { 
  getAllCategories, 
  deleteCategory 
} from '../../services/categoryService';
import type { ICategory } from '../../types/Category';
import { ConfirmationModal } from '../../components/ConfirmationModal';

const CategoriesList = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteCategory(categoryToDelete);
      toast.success('Category deleted successfully');
      setCategories(prev => prev.filter(cat => cat._id !== categoryToDelete));
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Link
          to="/admin-dashboard/categories/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Category
        </Link>
      </div>

      {categories.length > 0 ? (
        <div className="bg-white shadow-sm rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin-dashboard/categories/edit/${category._id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {category.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 max-w-md truncate">
                        {category.description || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin-dashboard/categories/edit/${category._id}`}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-sm hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(category._id)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-800 p-1 rounded-sm hover:bg-red-50 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-sm shadow-sm text-center">
          <p className="text-gray-600 mb-4">No categories found</p>
          <Link
            to="/admin-dashboard/categories/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create your first category
          </Link>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        isConfirming={isDeleting}
      />
    </div>
  );
};

export default CategoriesList;