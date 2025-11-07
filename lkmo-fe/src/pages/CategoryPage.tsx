import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import { recipeAPI } from '../services/api'
import { getImageUrl } from '../utils/imageUtils'

const CATEGORY_TYPES = {
  breakfast: {
    name: 'Sarapan',
    description:
      'Resep sarapan praktis yang bisa dibuat dengan cepat untuk memulai harimu.',
    image:
      'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  lunch: {
    name: 'Makan Siang',
    description:
      'Resep makan siang yang praktis dan mengenyangkan untuk tenaga di siang hari.',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  dinner: {
    name: 'Makan Malam',
    description:
      'Resep makan malam yang lezat dan praktis setelah seharian beraktivitas.',
    image:
      'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  snack: {
    name: 'Camilan',
    description:
      'Resep camilan simpel untuk menemani waktu belajar atau bersantai.',
    image:
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
}

interface Recipe {
  _id: string
  id?: string
  title: string
  image?: string | null
  rating: number
  prepTime: number
  equipment: string[]
  author: {
    name: string
    image?: string
  }
  price?: string
}

export default function CategoryPage() {
  const { type } = useParams()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (type) {
      loadRecipes()
    }
  }, [type])

  const loadRecipes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await recipeAPI.getAll({
        category: type as string,
        limit: 50
      })
      
      if (response.success && response.data?.recipes) {
        setRecipes(response.data.recipes)
      } else {
        setError('Gagal memuat resep')
      }
    } catch (err: any) {
      console.error('Error loading recipes:', err)
      setError(err.response?.data?.message || 'Gagal memuat resep')
    } finally {
      setLoading(false)
    }
  }

  const category = CATEGORY_TYPES[type as keyof typeof CATEGORY_TYPES] || {
    name: 'Kategori',
    description: 'Resep berdasarkan kategori',
    image:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
  }


  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="text-gray-500">Memuat resep...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative rounded-xl overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20"></div>
        </div>
        <div className="relative px-6 py-12 md:py-16 md:px-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {category.name}
          </h1>
          <p className="text-white/90 text-lg max-w-xl">
            {category.description}
          </p>
        </div>
      </section>

      {/* Recipes Grid */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Semua Resep ({recipes.length})
          </h2>
        </div>
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : recipes.length > 0 ? (
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada resep untuk kategori ini.</p>
            <a
              href="/upload"
              className="mt-4 inline-block px-6 py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600"
            >
              Upload Resep Pertama
            </a>
          </div>
        )}
      </section>
    </div>
  )
}
