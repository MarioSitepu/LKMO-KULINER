import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrophyIcon, UsersIcon, StarIcon, MedalIcon, FlameIcon } from 'lucide-react'
import { userAPI, recipeAPI } from '../services/api'
import RecipeCard from '../components/RecipeCard'
import { getImageUrl, getUserImageUrl } from '../utils/imageUtils'

interface LeaderboardUser {
  id: string
  name: string
  image?: string | null
  bio?: string
  value: number
  totalRatings?: number
  rank: number
}

interface LeaderboardData {
  popularRecipes: LeaderboardUser[]
  mostRecipes: LeaderboardUser[]
  highestRatings: LeaderboardUser[]
}

interface Recipe {
  _id: string
  title: string
  image: string | null
  rating: number
  prepTime: number
  equipment: string[]
  author: {
    name: string
    image?: string
  }
  price: string
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <MedalIcon className="w-6 h-6 text-yellow-500" />
    case 2:
      return <MedalIcon className="w-6 h-6 text-gray-400" />
    case 3:
      return <MedalIcon className="w-6 h-6 text-green-600" />
    default:
      return <span className="text-gray-600 font-bold">#{rank}</span>
  }
}

const getRankBgColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-yellow-50 border-yellow-200'
    case 2:
      return 'bg-gray-50 border-gray-200'
    case 3:
      return 'bg-green-50 border-green-200'
    default:
      return 'bg-white border-gray-200'
  }
}

export default function LeaderboardPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [leaderboardResponse, recipesResponse] = await Promise.all([
          userAPI.getLeaderboard(),
          recipeAPI.getPopular(6)
        ])
        
        setData(leaderboardResponse.data)
        
        if (recipesResponse.success && recipesResponse.data?.recipes) {
          setPopularRecipes(recipesResponse.data.recipes)
        }
      } catch (err: any) {
        setError(err.message || 'Gagal memuat leaderboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])


  const UserCard = ({ user, type }: { user: LeaderboardUser; type: 'popular' | 'most' | 'rating' }) => {
    const displayValue = () => {
      switch (type) {
        case 'popular':
          return `${user.value} disimpan`
        case 'most':
          return `${user.value} resep`
        case 'rating':
          return `${user.value.toFixed(1)} ⭐`
      }
    }

    const imageUrl = getUserImageUrl(user.image)

    const handleClick = () => {
      navigate(`/user/${user.id}`)
    }

    return (
      <div
        onClick={handleClick}
        className={`flex items-center gap-4 p-4 rounded-lg border-2 ${getRankBgColor(
          user.rank,
        )} transition-all hover:shadow-md cursor-pointer`}
      >
        <div className="flex items-center justify-center w-10 h-10">
          {getRankIcon(user.rank)}
        </div>
        <div className="flex-1 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-200 text-green-600 font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate">{user.name}</h3>
            {user.bio && (
              <p className="text-sm text-gray-500 truncate">{user.bio}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-green-600">{displayValue()}</div>
          {type === 'rating' && user.totalRatings && (
            <div className="text-xs text-gray-500">
              {user.totalRatings} rating
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat leaderboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <TrophyIcon className="text-green-500" />
          Leaderboard
        </h1>
        <p className="text-gray-600">
          Pengguna terbaik berdasarkan berbagai kategori
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resep Terpopuler */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <UsersIcon className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold text-gray-800">
              Resep Terpopuler
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            User dengan resep yang paling banyak disimpan
          </p>
          <div className="space-y-3">
            {data.popularRecipes.length > 0 ? (
              data.popularRecipes.map((user) => (
                <UserCard key={user.id} user={user} type="popular" />
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Belum ada data
              </p>
            )}
          </div>
        </div>

        {/* Resep Terbanyak */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrophyIcon className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold text-gray-800">
              Resep Terbanyak
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            User yang telah membuat resep paling banyak
          </p>
          <div className="space-y-3">
            {data.mostRecipes.length > 0 ? (
              data.mostRecipes.map((user) => (
                <UserCard key={user.id} user={user} type="most" />
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Belum ada data
              </p>
            )}
          </div>
        </div>

        {/* Rating Tertinggi */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <StarIcon className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold text-gray-800">
              Rating Tertinggi
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            User dengan rata-rata rating resep tertinggi
          </p>
          <div className="space-y-3">
            {data.highestRatings.length > 0 ? (
              data.highestRatings.map((user) => (
                <UserCard key={user.id} user={user} type="rating" />
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Belum ada data
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 6 Resep Terpopuler */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-6">
          <FlameIcon className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-800">6 Resep Terpopuler</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Resep yang paling banyak disimpan oleh pengguna
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularRecipes.length > 0 ? (
            popularRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                id={recipe._id}
                title={recipe.title}
                image={getImageUrl(recipe.image)}
                rating={recipe.rating || 0}
                prepTime={`${recipe.prepTime} menit`}
                equipment={recipe.equipment || []}
                author={recipe.author?.name || 'Unknown'}
                price={recipe.price || 'Rp 0'}
              />
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-8">
              Belum ada resep populer
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

