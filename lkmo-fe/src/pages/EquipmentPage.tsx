import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import { recipeAPI } from '../services/api'
import { getImageUrl } from '../utils/imageUtils'

const EQUIPMENT_TYPES = {
  'rice-cooker': {
    name: 'Rice Cooker',
    description:
      'Resep yang bisa dibuat hanya dengan rice cooker, cocok untuk anak kos yang tidak punya akses ke dapur.',
    image:
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    filterValue: 'Rice Cooker',
  },
  microwave: {
    name: 'Microwave',
    description: 'Resep cepat dan praktis yang bisa dibuat dengan microwave.',
    image:
      'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    filterValue: 'Microwave',
  },
  kompor: {
    name: 'Kompor',
    description: 'Resep yang bisa dibuat dengan kompor sederhana.',
    image:
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    filterValue: 'Kompor',
  },
  wajan: {
    name: 'Wajan',
    description: 'Resep yang bisa dibuat dengan wajan, cocok untuk menggoreng dan menumis.',
    image:
      'https://images.unsplash.com/photo-1556912173-7e0f1dbe6f1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    filterValue: 'Wajan',
  },
  'panci-rebus': {
    name: 'Panci rebus',
    description: 'Resep yang bisa dibuat dengan panci rebus, cocok untuk merebus dan memasak bahan.',
    image:
      'https://images.unsplash.com/photo-1587486514583-2a017c5c9e5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    filterValue: 'Panci rebus',
  },
  lainnya: {
    name: 'Peralatan Lainnya',
    description: 'Resep yang menggunakan peralatan lainnya selain peralatan utama.',
    image:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    filterValue: 'other',
  },
  // Keep backward compatibility
  'portable-stove': {
    name: 'Kompor',
    description: 'Resep yang bisa dibuat dengan kompor portable sederhana.',
    image:
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    filterValue: 'Kompor',
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

export default function EquipmentPage() {
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
      
      const equipmentInfo = EQUIPMENT_TYPES[type as keyof typeof EQUIPMENT_TYPES]
      if (!equipmentInfo) {
        setError('Peralatan tidak ditemukan')
        return
      }

      const response = await recipeAPI.getAll({
        equipment: equipmentInfo.filterValue,
        limit: 100 // Increase limit for "other" filter since we filter in-memory
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

  const equipment = EQUIPMENT_TYPES[type as keyof typeof EQUIPMENT_TYPES] || {
    name: 'Peralatan',
    description: 'Resep berdasarkan peralatan',
    image:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    filterValue: '',
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
            src={equipment.image}
            alt={equipment.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20"></div>
        </div>
        <div className="relative px-6 py-12 md:py-16 md:px-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Resep dengan {equipment.name}
          </h1>
          <p className="text-white/90 text-lg max-w-xl">
            {equipment.description}
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
              Belum ada resep untuk peralatan ini.
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
