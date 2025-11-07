import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { ChefHat, Search, Trash2, Eye } from 'lucide-react';

interface RecipeData {
  _id: string;
  title: string;
  image?: string;
  category: string;
  rating: number;
  prepTime: number;
  author: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
}

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadRecipes();
  }, [page, search]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getRecipes({ page, limit: 20, search });
      if (response.success) {
        setRecipes(response.data.recipes);
        setTotalPages(response.data.pagination.pages);
      } else {
        setError('Gagal memuat data recipes');
      }
    } catch (err: any) {
      setError(err.message || 'Error saat memuat recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus resep ini? Semua review yang terkait juga akan dihapus.')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await adminAPI.deleteRecipe(id);
      if (response.success) {
        loadRecipes();
      } else {
        alert('Gagal menghapus recipe');
      }
    } catch (err: any) {
      alert(err.message || 'Error saat menghapus recipe');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadRecipes();
  };

  const categoryNames: { [key: string]: string } = {
    breakfast: 'Sarapan',
    lunch: 'Makan Siang',
    dinner: 'Makan Malam',
    snack: 'Camilan'
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Recipes</h1>
            <p className="text-gray-600">Kelola resep masakan</p>
          </div>
          <Link
            to="/admin"
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari resep berdasarkan judul..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Cari
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat recipes...</p>
          </div>
        </div>
      ) : recipes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <ChefHat className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">Tidak ada resep ditemukan</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recipes.map((recipe) => (
                  <tr key={recipe._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          {recipe.image ? (
                            <img
                              className="h-16 w-16 rounded-lg object-cover"
                              src={recipe.image}
                              alt={recipe.title}
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                              <ChefHat className="text-gray-400" size={24} />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{recipe.title}</div>
                          <div className="text-sm text-gray-500">
                            {recipe.prepTime} menit • {new Date(recipe.createdAt).toLocaleDateString('id-ID')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          {recipe.author.image ? (
                            <img
                              className="h-8 w-8 rounded-full"
                              src={recipe.author.image}
                              alt={recipe.author.name}
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold">
                              {recipe.author.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{recipe.author.name}</div>
                          <div className="text-sm text-gray-500">{recipe.author.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {categoryNames[recipe.category] || recipe.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ⭐ {recipe.rating.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/recipe/${recipe._id}`}
                          className="text-blue-600 hover:text-blue-900"
                          target="_blank"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(recipe._id)}
                          disabled={deletingId === recipe._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deletingId === recipe._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

