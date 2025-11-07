import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import { recipeAPI } from '../services/api'
import { getImageUrl } from '../utils/imageUtils'

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

interface Category {
  name: string
  image: string
  path: string
  count: number
}

export default function HomePage() {
  const [latestRecipes, setLatestRecipes] = useState<Recipe[]>([])
  const [popularCategories, setPopularCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load latest recipes and popular categories in parallel
      const [latestResponse, categoriesResponse] = await Promise.all([
        recipeAPI.getLatest(4),
        recipeAPI.getPopularCategories()
      ])

      if (latestResponse.success && latestResponse.data?.recipes) {
        setLatestRecipes(latestResponse.data.recipes)
      }

      if (categoriesResponse.success && categoriesResponse.data?.categories) {
        setPopularCategories(categoriesResponse.data.categories)
      }
    } catch (err: any) {
      console.error('Error loading data:', err)
      setError(err.response?.data?.message || 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="text-gray-500">Memuat data...</div>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
            alt="Cooking"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20"></div>
        </div>
        <div className="relative px-6 py-16 md:py-24 md:px-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tempatnya Resep Makanan Praktis ala Anak Kos!
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl mb-6">
            Temukan dan bagikan resep masakan yang mudah, cepat, dan pastinya
            ramah di kantong!
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/upload"
              className="px-6 py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors"
            >
              Upload Resep
            </Link>
            <Link
              to="/category/breakfast"
              className="px-6 py-3 bg-white text-green-500 font-medium rounded-md hover:bg-green-50 transition-colors"
            >
              Jelajahi Resep
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Kategori Populer</h2>
          <Link to="/category/breakfast" className="text-green-500 hover:underline">
            Lihat Semua
          </Link>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularCategories.length > 0 ? (
            popularCategories.map((category, index) => (
              <Link
                key={index}
                to={category.path}
                className="relative rounded-lg overflow-hidden h-32 group"
              >
                <img
                  src={getImageUrl(category.image)}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-lg font-bold text-white">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-4 text-center text-gray-500 py-8">
              Belum ada kategori
            </div>
          )}
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Resep Terbaru</h2>
          <Link to="/category/breakfast" className="text-green-500 hover:underline">
            Lihat Semua
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestRecipes.length > 0 ? (
            latestRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                id={recipe._id}
                title={recipe.title}
                image={recipe.image}
                rating={recipe.rating || 0}
                prepTime={`${recipe.prepTime} menit`}
                equipment={recipe.equipment || []}
                author={recipe.author?.name || 'Unknown'}
                price={recipe.price || 'Rp 0'}
              />
            ))
          ) : (
            <div className="col-span-4 text-center text-gray-500 py-8">
              Belum ada resep. Jadilah yang pertama untuk membagikan resep!
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-100 rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Punya Resep Andalan?
            </h2>
            <p className="text-gray-600">
              Bagikan resep favoritmu dan bantu anak kos lainnya makan enak
              dengan budget terbatas!
            </p>
          </div>
          <Link
            to="/upload"
            className="px-6 py-3 bg-green-500 text-center text-white font-medium rounded-md hover:bg-green-600 transition-colors md:whitespace-nowrap"
          >
            Upload Resep Sekarang
          </Link>
        </div>
      </section>
    </div>
  )
}