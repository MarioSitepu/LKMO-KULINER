import { useParams } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'

const EQUIPMENT_TYPES = {
  'rice-cooker': {
    name: 'Rice Cooker',
    description:
      'Resep yang bisa dibuat hanya dengan rice cooker, cocok untuk anak kos yang tidak punya akses ke dapur.',
    image:
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  microwave: {
    name: 'Microwave',
    description: 'Resep cepat dan praktis yang bisa dibuat dengan microwave.',
    image:
      'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  'portable-stove': {
    name: 'Kompor Portable',
    description: 'Resep yang bisa dibuat dengan kompor portable sederhana.',
    image:
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
}
const RICE_COOKER_RECIPES = [
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
    id: '3',
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
    id: '4',
    title: 'Mac & Cheese Rice Cooker',
    image:
      'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    prepTime: '25 menit',
    equipment: ['Rice Cooker'],
    author: 'Andi Wijaya',
    price: 'Rp 16.000',
  },
  {
    id: '5',
    title: 'Bubur Ayam Rice Cooker',
    image:
      'https://images.unsplash.com/photo-1626509653291-18d9a934b9db?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    prepTime: '40 menit',
    equipment: ['Rice Cooker'],
    author: 'Lina Susanti',
    price: 'Rp 18.000',
  },
  {
    id: '6',
    title: 'Puding Karamel Rice Cooker',
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    prepTime: '35 menit',
    equipment: ['Rice Cooker'],
    author: 'Rini Puspita',
    price: 'Rp 22.000',
  },
]
const MICROWAVE_RECIPES = [
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
    title: 'Mac & Cheese Microwave',
    image:
      'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    prepTime: '12 menit',
    equipment: ['Microwave'],
    author: 'Dewi Putri',
    price: 'Rp 15.000',
  },
]
const PORTABLE_STOVE_RECIPES = [
  {
    id: '1',
    title: 'Telur Dadar Mie Instan',
    image:
      'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    prepTime: '15 menit',
    equipment: ['Kompor Portable'],
    author: 'Budi Santoso',
    price: 'Rp 8.000',
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
const getRecipesByEquipment = (type: string | undefined) => {
  switch (type) {
    case 'rice-cooker':
      return RICE_COOKER_RECIPES
    case 'microwave':
      return MICROWAVE_RECIPES
    case 'portable-stove':
      return PORTABLE_STOVE_RECIPES
    default:
      return []
  }
}

export default function EquipmentPage() {
  const { type } = useParams()
  const equipment = EQUIPMENT_TYPES[type as keyof typeof EQUIPMENT_TYPES] || {
    name: 'Peralatan',
    description: 'Resep berdasarkan peralatan',
    image:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
  }
  const recipes = getRecipesByEquipment(type)
  
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