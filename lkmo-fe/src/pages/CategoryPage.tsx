import { useParams } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'

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

const BREAKFAST_RECIPES = [
  {
    id: '1',
    title: 'Roti Panggang Telur Keju',
    image:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    prepTime: '10 menit',
    equipment: ['Microwave'],
    author: 'Andi Wijaya',
    price: 'Rp 6.000',
  },
  {
    id: '2',
    title: 'Overnight Oats',
    image:
      'https://images.unsplash.com/photo-1502373737927-465e630374e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    prepTime: '5 menit + semalaman',
    equipment: ['No Cook'],
    author: 'Siti Aminah',
    price: 'Rp 10.000',
  },
  {
    id: '3',
    title: 'Smoothie Pisang',
    image:
      'https://images.unsplash.com/photo-1553530666-ba11a90bb437?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    prepTime: '5 menit',
    equipment: ['Blender'],
    author: 'Dewi Putri',
    price: 'Rp 7.000',
  },
]

const LUNCH_RECIPES = [
  {
    id: '1',
    title: 'Nasi Goreng Rice Cooker',
    image:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    prepTime: '20 menit',
    equipment: ['Rice Cooker'],
    author: 'Siti Aminah',
    price: 'Rp 12.000',
  },
  {
    id: '2',
    title: 'Pasta Aglio e Olio Simple',
    image:
      'https://images.unsplash.com/photo-1556761223-4c4282c73f77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prepTime: '25 menit',
    equipment: ['Kompor Portable'],
    author: 'Siti Aminah',
    price: 'Rp 18.000',
  },
]

const DINNER_RECIPES = [
  {
    id: '1',
    title: 'Sup Ayam Rice Cooker',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    prepTime: '30 menit',
    equipment: ['Rice Cooker'],
    author: 'Budi Santoso',
    price: 'Rp 20.000',
  },
  {
    id: '2',
    title: 'Telur Dadar Mie Instan',
    image:
      'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    prepTime: '15 menit',
    equipment: ['Kompor Portable'],
    author: 'Budi Santoso',
    price: 'Rp 8.000',
  },
]

const SNACK_RECIPES = [
  {
    id: '1',
    title: 'Cake Coklat Rice Cooker',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    prepTime: '45 menit',
    equipment: ['Rice Cooker'],
    author: 'Dewi Putri',
    price: 'Rp 25.000',
  },
  {
    id: '2',
    title: 'Sandwich Tuna Mayo',
    image:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    prepTime: '10 menit',
    equipment: ['No Cook'],
    author: 'Andi Wijaya',
    price: 'Rp 9.000',
  },
]

const getRecipesByCategory = (type: string | undefined) => {
  switch (type) {
    case 'breakfast':
      return BREAKFAST_RECIPES
    case 'lunch':
      return LUNCH_RECIPES
    case 'dinner':
      return DINNER_RECIPES
    case 'snack':
      return SNACK_RECIPES
    default:
      return []
  }
}

export default function CategoryPage() {
  const { type } = useParams()
  const category = CATEGORY_TYPES[type as keyof typeof CATEGORY_TYPES] || {
    name: 'Kategori',
    description: 'Resep berdasarkan kategori',
    image:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
  }
  const recipes = getRecipesByCategory(type)
  
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
          <div>
            <select className="p-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:ring-orange-500 focus:border-orange-500">
              <option value="newest">Terbaru</option>
              <option value="popular">Terpopuler</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="time">Waktu Tercepat</option>
            </select>
          </div>
        </div>
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada resep untuk kategori ini.</p>
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