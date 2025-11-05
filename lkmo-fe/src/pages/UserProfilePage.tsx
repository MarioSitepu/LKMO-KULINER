import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import RecipeCard from '../components/RecipeCard'
import { userAPI } from '../services/api'

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

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profileData, setProfileData] = useState<any>(null)
  const [recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    if (id) {
      loadProfile()
    }
  }, [id])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await userAPI.getUserById(id!)
      if (response.success && response.data) {
        setProfileData(response.data)
        setRecipes(response.data.recipes || [])
      } else {
        setError('User tidak ditemukan')
      }
    } catch (err: any) {
      console.error('Error loading profile:', err)
      setError(err.message || 'Gagal memuat profil user')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  }

  const getImageUrl = (image: string | null | undefined) => {
    if (!image) return 'https://via.placeholder.com/200'
    if (image.startsWith('http')) return image
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    // Remove /api from end if present (for static files)
    if (baseUrl.endsWith('/api')) {
      baseUrl = baseUrl.replace(/\/api$/, '')
    }
    return `${baseUrl}${image}`
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-gray-500">Memuat profil...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            to="/leaderboard"
            className="inline-block px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Kembali ke Leaderboard
          </Link>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return null
  }

  const profile = profileData.user
  const stats = profileData.stats || {
    recipesCount: 0,
    followersCount: 0,
    followingCount: 0,
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
          </div>
          {profile?.bio && (
            <p className="text-gray-700 mb-4">{profile.bio}</p>
          )}
          {profile?.location && (
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
              <MapPin size={16} className="flex-shrink-0" />
              <span>{profile.location}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center text-gray-600">
              <span className="font-medium text-gray-900 mr-1">
                {stats.recipesCount || 0}
              </span>{' '}
              Resep
            </div>
            {stats.followersCount !== undefined && (
              <div className="flex items-center text-gray-600">
                <span className="font-medium text-gray-900 mr-1">
                  {stats.followersCount || 0}
                </span>{' '}
                Pengikut
              </div>
            )}
            {stats.followingCount !== undefined && (
              <div className="flex items-center text-gray-600">
                <span className="font-medium text-gray-900 mr-1">
                  {stats.followingCount || 0}
                </span>{' '}
                Mengikuti
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Resep oleh {profile?.name || 'User'}
          </h2>
        </div>
        {recipes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>User ini belum membuat resep.</p>
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
      </div>
    </div>
  )
}

