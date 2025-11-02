import RecipeCard from '../components/RecipeCard'

const FEATURED_RECIPES = [
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
    id: '3',
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
    id: '4',
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

const POPULAR_CATEGORIES = [
  {
    name: 'Sarapan',
    image:
      'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    path: '/category/breakfast',
  },
  {
    name: 'Rice Cooker',
    image:
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    path: '/equipment/rice-cooker',
  },
  {
    name: 'Makan Siang',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    path: '/category/lunch',
  },
  {
    name: 'Camilan',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    path: '/category/snack',
  },
]

export default function HomePage() {
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
            <a
              href="/upload"
              className="px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors"
            >
              Upload Resep
            </a>
            <a
              href="/category/breakfast"
              className="px-6 py-3 bg-white text-orange-500 font-medium rounded-md hover:bg-orange-50 transition-colors"
            >
              Jelajahi Resep
            </a>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Kategori Populer</h2>
          <a href="/categories" className="text-orange-500 hover:underline">
            Lihat Semua
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {POPULAR_CATEGORIES.map((category, index) => (
            <a
              key={index}
              href={category.path}
              className="relative rounded-lg overflow-hidden h-32 group"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-lg font-bold text-white">
                  {category.name}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Resep Terbaru</h2>
          <a href="/recipes" className="text-orange-500 hover:underline">
            Lihat Semua
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_RECIPES.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-orange-100 rounded-xl p-6 md:p-8">
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
          <a
            href="/upload"
            className="px-6 py-3 bg-orange-500 text-center text-white font-medium rounded-md hover:bg-orange-600 transition-colors md:whitespace-nowrap"
          >
            Upload Resep Sekarang
          </a>
        </div>
      </section>
    </div>
  )
}