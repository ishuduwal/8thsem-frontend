import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProductReviews } from '../../types/Review';
import productService from '../../services/productService';
import { StarRating } from '../StarRating';
import { getCurrentUser, isAuthenticated } from '../../utils/jwtUtlis'; 

interface ProductReviewsProps {
  productId: string;
}

export const ProductReview = ({ productId }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<ProductReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const authenticated = isAuthenticated();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const reviewsData = await productService.getProductReviews(productId);
      setReviews(reviewsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const requireAuth = (): boolean => {
    if (!authenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return false;
    }
    return true;
  };

  const handleAddRating = async () => {
    if (!requireAuth()) return;
    
    if (newRating < 1 || newRating > 5) {
      setError('Rating must be between 1 and 5');
      return;
    }

    try {
      await productService.addRating(productId, { value: newRating });
      setNewRating(0);
      fetchReviews();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add rating';
      setError(errorMessage);
      
      // If it's an authentication error, redirect to login
      if (errorMessage.includes('not authenticated') || errorMessage.includes('User and rating value are required')) {
        navigate('/login', { state: { from: window.location.pathname } });
      }
    }
  };

  const handleAddComment = async () => {
    if (!requireAuth()) return;
    
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      await productService.addComment(productId, { text: newComment });
      setNewComment('');
      fetchReviews();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add comment';
      setError(errorMessage);
      
      // If it's an authentication error, redirect to login
      if (errorMessage.includes('not authenticated') || errorMessage.includes('User and text are required')) {
        navigate('/login', { state: { from: window.location.pathname } });
      }
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!requireAuth()) return;
    
    if (!replyText.trim()) {
      setError('Reply cannot be empty');
      return;
    }

    try {
      await productService.addReply(productId, commentId, { text: replyText });
      setReplyText('');
      setReplyingTo(null);
      fetchReviews();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add reply';
      setError(errorMessage);
      
      // If it's an authentication error, redirect to login
      if (errorMessage.includes('not authenticated') || errorMessage.includes('User and text are required')) {
        navigate('/login', { state: { from: window.location.pathname } });
      }
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!requireAuth()) return;
    
    try {
      await productService.likeComment(productId, commentId);
      fetchReviews();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to like comment';
      setError(errorMessage);
      
      // If it's an authentication error, redirect to login
      if (errorMessage.includes('not authenticated')) {
        navigate('/login', { state: { from: window.location.pathname } });
      }
    }
  };

  const handleLikeReply = async (commentId: string, replyId: string) => {
    if (!requireAuth()) return;
    
    try {
      await productService.likeReply(productId, commentId, replyId);
      fetchReviews();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to like reply';
      setError(errorMessage);
      
      // If it's an authentication error, redirect to login
      if (errorMessage.includes('not authenticated')) {
        navigate('/login', { state: { from: window.location.pathname } });
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!requireAuth()) return;
    
    try {
      await productService.deleteComment(productId, commentId);
      fetchReviews();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete comment';
      setError(errorMessage);
      
      // If it's an authentication error, redirect to login
      if (errorMessage.includes('not authenticated')) {
        navigate('/login', { state: { from: window.location.pathname } });
      }
    }
  };

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    if (!requireAuth()) return;
    
    try {
      await productService.deleteReply(productId, commentId, replyId);
      fetchReviews();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete reply';
      setError(errorMessage);
      
      // If it's an authentication error, redirect to login
      if (errorMessage.includes('not authenticated')) {
        navigate('/login', { state: { from: window.location.pathname } });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !reviews) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex items-center mb-4">
          <div className="text-4xl font-bold mr-4">{reviews?.averageRating?.toFixed(1) || '0.0'}</div>
          <div>
            <StarRating rating={reviews?.averageRating || 0} size="lg" />
            <p className="text-sm text-gray-600 mt-1">
              Based on {reviews?.totalRatings || 0} ratings
            </p>
          </div>
        </div>

        {authenticated ? (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Rate this product</h3>
            <div className="flex items-center mb-2">
              <StarRating
                rating={newRating}
                interactive={true}
                onRatingChange={setNewRating}
              />
            </div>
            <button
              onClick={handleAddRating}
              disabled={newRating === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
            >
              Submit Rating
            </button>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800">
              Please <button onClick={() => navigate('/login')} className="text-blue-600 underline">login</button> to rate this product.
            </p>
          </div>
        )}
      </div>

      {authenticated ? (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Write a review</h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
          >
            Submit Review
          </button>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-yellow-800">
            Please <button onClick={() => navigate('/login')} className="text-blue-600 underline">login</button> to write a review.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {reviews?.comments?.map((comment) => (
          <div key={comment._id} className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {comment.user?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <h4 className="font-semibold">{comment.user || 'Unknown User'}</h4>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 mb-3">{comment.text}</p>

            {authenticated && (
              <div className="flex items-center space-x-4 mb-3">
                <button
                  onClick={() => handleLikeComment(comment._id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                >
                  <span>👍</span>
                  <span>{comment.likes?.length || 0}</span>
                </button>

                <button
                  onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Reply
                </button>

                {comment.user === currentUser && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}

            {/* Reply Form */}
            {replyingTo === comment._id && authenticated && (
              <div className="ml-6 mt-3">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={2}
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleAddReply(comment._id)}
                    disabled={!replyText.trim()}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm disabled:bg-gray-400 hover:bg-blue-700"
                  >
                    Post Reply
                  </button>
                  <button
                    onClick={() => {
                      setReplyText('');
                      setReplyingTo(null);
                    }}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-6 mt-3 space-y-3">
                {comment.replies.map((reply) => (
                  <div key={reply._id} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="font-medium text-sm">{reply.user || 'Unknown User'}</h5>
                      <span className="text-xs text-gray-500">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{reply.text}</p>
                    {authenticated && (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleLikeReply(comment._id, reply._id)}
                          className="flex items-center space-x-1 text-xs text-gray-600 hover:text-blue-600"
                        >
                          <span>👍</span>
                          <span>{reply.likes?.length || 0}</span>
                        </button>
                        {reply.user === currentUser && (
                          <button
                            onClick={() => handleDeleteReply(comment._id, reply._id)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {(!reviews?.comments || reviews.comments.length === 0) && (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};