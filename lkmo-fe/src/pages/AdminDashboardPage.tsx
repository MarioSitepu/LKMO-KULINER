import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { 
  Users, 
  ChefHat, 
  Star, 
  Shield, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Bell,
  Key
} from 'lucide-react';

interface DashboardData {
  totalUsers: number;
  totalRecipes: number;
  totalReviews: number;
  totalAdmins: number;
  newUsers: number;
  newRecipes: number;
  recipesByCategory: Array<{ _id: string; count: number }>;
  topUsers: Array<{
    _id: string;
    name: string;
    email: string;
    image?: string;
    recipeCount: number;
  }>;
  passwordResetNotifications: Array<{
    email: string;
    userName: string;
    resetAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getDashboard();
      if (response.success) {
        setData(response.data);
      } else {
        setError('Gagal memuat data dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error saat memuat dashboard');
    } finally {
      setLoading(false);
    }
  };

  const categoryNames: { [key: string]: string } = {
    breakfast: 'Sarapan',
    lunch: 'Makan Siang',
    dinner: 'Makan Malam',
    snack: 'Camilan'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadDashboard}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Ringkasan data dan statistik aplikasi</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{data.totalUsers}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="text-green-500 mr-1" size={16} />
            <span className="text-gray-600">{data.newUsers} user baru (7 hari terakhir)</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Recipes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{data.totalRecipes}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <ChefHat className="text-orange-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="text-green-500 mr-1" size={16} />
            <span className="text-gray-600">{data.newRecipes} resep baru (7 hari terakhir)</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{data.totalReviews}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Star className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{data.totalAdmins}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Shield className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipes by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Resep per Kategori</h2>
          <div className="space-y-4">
            {data.recipesByCategory.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    {categoryNames[cat._id] || cat._id}
                  </span>
                </div>
                <span className="font-semibold text-gray-900">{cat.count}</span>
              </div>
            ))}
          </div>
          <Link
            to="/admin/recipes"
            className="mt-6 flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            Lihat semua resep <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>

        {/* Top Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Contributors</h2>
          <div className="space-y-4">
            {data.topUsers.length > 0 ? (
              data.topUsers.map((user, index) => (
                <div key={user._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">{user.recipeCount} resep</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Belum ada data</p>
            )}
          </div>
          <Link
            to="/admin/users"
            className="mt-6 flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            Lihat semua users <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
      </div>

      {/* Password Reset Notifications */}
      {data.passwordResetNotifications && data.passwordResetNotifications.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Bell className="text-orange-600 mr-2" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Password Reset Notifications</h2>
          </div>
          <div className="space-y-3">
            {data.passwordResetNotifications.map((notification, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg"
              >
                <div className="flex items-center">
                  <Key className="text-orange-600 mr-3" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">{notification.userName}</p>
                    <p className="text-sm text-gray-600">{notification.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.resetAt).toLocaleString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Berhasil
                </span>
              </div>
            ))}
          </div>
          {data.passwordResetNotifications.length === 0 && (
            <p className="text-gray-500 text-center py-4">Tidak ada notifikasi password reset</p>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/users"
            className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
          >
            <Users className="text-orange-600 mb-2" size={24} />
            <h3 className="font-semibold text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-600 mt-1">Kelola pengguna dan peran</p>
          </Link>
          <Link
            to="/admin/recipes"
            className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
          >
            <ChefHat className="text-orange-600 mb-2" size={24} />
            <h3 className="font-semibold text-gray-900">Manage Recipes</h3>
            <p className="text-sm text-gray-600 mt-1">Kelola resep masakan</p>
          </Link>
          <Link
            to="/admin/reviews"
            className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
          >
            <Star className="text-orange-600 mb-2" size={24} />
            <h3 className="font-semibold text-gray-900">Manage Reviews</h3>
            <p className="text-sm text-gray-600 mt-1">Kelola ulasan dan rating</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

