import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import discountService from '../../services/discountService';
import type { Discount } from '../../types/Discount';
import { formatDate } from '../../utils/dateUtlis';

const DiscountsList = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    discountId: string;
    discountName: string;
  }>({
    isOpen: false,
    discountId: '',
    discountName: ''
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await discountService.getAllDiscounts();
      if (response.success && Array.isArray(response.data)) {
        setDiscounts(response.data);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch discounts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (discountId: string, discountName: string) => {
    setDeleteModal({
      isOpen: true,
      discountId,
      discountName
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await discountService.deleteDiscount(deleteModal.discountId);
      if (response.success) {
        toast.success('Discount deleted successfully');
        fetchDiscounts(); // Refresh the list
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete discount');
    } finally {
      setDeleteModal({ isOpen: false, discountId: '', discountName: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, discountId: '', discountName: '' });
  };

  const getStatusBadge = (discount: Discount) => {
    const now = new Date();
    if (!discount.isActive) {
      return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>;
    }
    if (new Date(discount.startDate) > now) {
      return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Scheduled</span>;
    }
    if (new Date(discount.endDate) < now) {
      return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Expired</span>;
    }
    return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
  };

  const getTargetText = (discount: Discount) => {
    switch (discount.applyTo) {
      case 'ALL':
        return 'All Products';
      case 'CATEGORY':
        return `${discount.targetIds.length} Categories`;
      case 'PRODUCT':
        return `${discount.targetIds.length} Products`;
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discounts</h1>
          <p className="text-gray-600">{discounts.length} total discounts</p>
        </div>
        <Link
          to="/admin-dashboard/discounts/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Add New Discount
        </Link>
      </div>

      {discounts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No discounts found</div>
          <Link
            to="/admin-dashboard/discounts/new"
            className="text-indigo-600 hover:text-indigo-800 font-medium mt-2 inline-block"
          >
            Create your first discount
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applies To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discounts.map((discount) => (
                <tr key={discount._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{discount.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {discount.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-semibold">
                      {discount.percentage}% OFF
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getTargetText(discount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(discount.startDate)} - {formatDate(discount.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(discount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      to={`/admin-dashboard/discounts/edit/${discount._id}`}
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(discount._id!, discount.name)}
                      className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Discount"
        message={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold">"{deleteModal.discountName}"</span>? This action cannot be undone.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        onClose={handleDeleteCancel}
        type="danger"
      />
    </div>
  );
};

export default DiscountsList;