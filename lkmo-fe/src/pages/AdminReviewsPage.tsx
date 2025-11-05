import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { Star, Trash2, Eye } from 'lucide-react';

interface ReviewData {
  _id: string;
  rating: number;
  comment: string;
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  recipe: {
    _id: string;
    title: string;
    image?: string;
  };
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, [page]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getReviews({ page, limit: 20 });
      if (response.success) {
        setReviews(response.data.reviews);
        setTotalPages(response.data.pagination.pages);
      } else {
        setError('Gagal memuat data reviews');
      }
    } catch (err: any) {
      setError(err.message || 'Error saat memuat reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus review ini? Rating recipe akan diupdate otomatis.')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await adminAPI.deleteReview(id);
      if (response.success) {
        loadReviews();
      } else {
        alert('Gagal menghapus review');
      }
    } catch (err: any) {
      alert(err.message || 'Error saat menghapus review');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Reviews</h1>
            <p className="text-gray-600">Kelola ulasan dan rating</p>
          </div>
          <Link
            to="/admin"
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat reviews...</p>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Star className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">Tidak ada review ditemukan</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 h-10 w-10">
                        {review.user.image ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={review.user.image}
                            alt={review.user.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                            {review.user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{review.user.name}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{review.user.email}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <Link
                        to={`/recipe/${review.recipe._id}`}
                        className="flex items-center gap-2 hover:text-orange-600"
                      >
                        <Eye size={16} />
                        <span>{review.recipe.title}</span>
                      </Link>
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(review._id)}
                    disabled={deletingId === review._id}
                    className="ml-4 text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {deletingId === review._id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

