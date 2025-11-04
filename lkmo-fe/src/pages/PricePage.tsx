import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import { recipeAPI } from '../services/api'

const PRICE_TYPES = {
  'under-10000': {
    name: 'Dibawah Rp 10.000',
    description: 'Resep ekonomis dengan budget terbatas, cocok untuk anak kos.',
    image:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    filterValue: 'under-10000',
  },
  '10000-25000': {
    name: 'Rp 10.000 - Rp 25.000',
    description: 'Resep dengan harga menengah, seimbang antara kualitas dan harga.',
    image:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    filterValue: '10000-25000',
  },
  'over-25000': {
    name: 'Diatas Rp 25.000',
    description: 'Resep dengan bahan berkualitas tinggi dan lebih lengkap.',
    image:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    filterValue: 'over-25000',
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

export default function PricePage() {
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
      
      const priceInfo = PRICE_TYPES[type as keyof typeof PRICE_TYPES]
      if (!priceInfo) {
        setError('Kategori harga tidak ditemukan')
        return
      }

      const response = await recipeAPI.getAll({
        priceRange: priceInfo.filterValue,
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

  const priceInfo = PRICE_TYPES[type as keyof typeof PRICE_TYPES] || {
    name: 'Harga',
    description: 'Resep berdasarkan harga',
    image:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    filterValue: '',
  }

  const getImageUrl = (image: string | null | undefined) => {
    if (!image) return 'https://via.placeholder.com/400x300?text=No+Image'
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
            src={priceInfo.image}
            alt={priceInfo.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20"></div>
        </div>
        <div className="relative px-6 py-12 md:py-16 md:px-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Resep {priceInfo.name}
          </h1>
          <p className="text-white/90 text-lg max-w-xl">
            {priceInfo.description}
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
            <p className="text-gray-500">
              Belum ada resep untuk range harga ini.
            </p>
            <a
              href="/upload"
              className="mt-4 inline-block px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
            >
              Upload Resep Pertama
            </a>
          </div>
        )}
      </section>
    </div>
  )
}

