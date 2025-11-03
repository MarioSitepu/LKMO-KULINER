import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookmarkIcon, LogOutIcon } from 'lucide-react'
import RecipeCard from '../components/RecipeCard'
import { userAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

interface Recipe {
  _id: string
  id?: string
  title: string
  image?: string | null
  rating: number
  prepTime: number | string
  equipment: string[]
  author: {
    name: string
    image?: string
  }
  price?: string
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('recipes')
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState<any>(null)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    loadProfile()
  }, [isAuthenticated, navigate])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getProfile()
      setProfileData(response.data)
      setRecipes(response.data.recipes || [])
      setSavedRecipes(response.data.savedRecipes || [])
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-500">Memuat profil...</div>
        </div>
      </div>
    )
  }

  const profile = profileData?.user || user
  const stats = profileData?.stats || {
    recipesCount: 0,
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  }

  const getImageUrl = (image: string | null | undefined) => {
    if (!image) return 'https://via.placeholder.com/200'
    if (image.startsWith('http')) return image
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    return `${apiUrl}${image}`
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="bg-orange-100 h-32"></div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-4 gap-4">
            <div className="relative">
              <img
                src={getImageUrl(profile?.image)}
                alt={profile?.name || 'User'}
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {profile?.name || 'User'}
              </h1>
              {profile?.createdAt && (
                <p className="text-gray-500 text-sm">
                  Bergabung {formatDate(profile.createdAt)}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Link
                to="/edit-profile"
                className="px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
              >
                Edit Profil
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                title="Logout"
              >
                <LogOutIcon size={18} />
              </button>
            </div>
          </div>
          {profile?.bio && (
            <p className="text-gray-700 mb-4">{profile.bio}</p>
          )}
          {profile?.location && (
            <p className="text-gray-500 text-sm mb-4">{profile.location}</p>
          )}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center text-gray-600">
              <span className="font-medium text-gray-900 mr-1">
                {stats.recipesCount || 0}
              </span>{' '}
              Resep
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex overflow-x-auto">
          <button
            className={`py-3 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'recipes'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('recipes')}
          >
            Resep Saya
          </button>
          <button
            className={`py-3 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'saved'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('saved')}
          >
            <div className="flex items-center">
              <BookmarkIcon size={16} className="mr-2" />
              Tersimpan
            </div>
          </button>
        </div>
      </div>

      {/* Recipe Grid */}
      <div>
        {activeTab === 'recipes' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Resep Saya</h2>
              <Link to="/upload" className="text-orange-500 hover:underline">
                + Tambah Resep Baru
              </Link>
            </div>
            {recipes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Belum ada resep. Mulai dengan membuat resep pertama!</p>
                <Link
                  to="/upload"
                  className="mt-4 inline-block text-orange-500 hover:underline"
                >
                  Upload Resep
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe._id || recipe.id}
                    id={recipe._id || recipe.id || ''}
                    title={recipe.title}
                    image={getImageUrl(recipe.image)}
                    rating={recipe.rating || 0}
                    prepTime={`${recipe.prepTime} menit`}
                    equipment={recipe.equipment || []}
                    author={recipe.author?.name || 'Unknown'}
                    price={recipe.price || ''}
                  />
                ))}
              </div>
            )}
          </>
        )}
        {activeTab === 'saved' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Resep Tersimpan
              </h2>
            </div>
            {savedRecipes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Belum ada resep yang disimpan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe._id || recipe.id}
                    id={recipe._id || recipe.id || ''}
                    title={recipe.title}
                    image={getImageUrl(recipe.image)}
                    rating={recipe.rating || 0}
                    prepTime={`${recipe.prepTime} menit`}
                    equipment={recipe.equipment || []}
                    author={recipe.author?.name || 'Unknown'}
                    price={recipe.price || ''}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
