import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SettingsIcon, BookmarkIcon, LogOutIcon } from 'lucide-react'
import RecipeCard from '../components/RecipeCard'

const USER_PROFILE = {
  name: 'Budi Santoso',
  image:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  bio: 'Mahasiswa teknik informatika hobi masak makanan simpel tapi enak. Spesialis masakan rice cooker.',
  location: 'Medan, Indonesia',
  joinDate: 'April 2023',
  recipes: 8,
  followers: 124,
  following: 56,
}

const USER_RECIPES = [
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
    author: 'Budi Santoso',
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
    author: 'Budi Santoso',
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
    author: 'Budi Santoso',
    price: 'Rp 15.000',
  },
]

const SAVED_RECIPES = [
  {
    id: '5',
    title: 'Pasta Aglio e Olio Simple',
    image:
      'https://images.unsplash.com/photo-1556761223-4c4282c73f77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prepTime: '25 menit',
    equipment: ['Kompor Portable'],
    author: 'Siti Aminah',
    price: 'Rp 18.000',
  },
  {
    id: '6',
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

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('recipes')
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="bg-orange-100 h-32"></div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-4 gap-4">
            <div className="relative">
              <img
                src={USER_PROFILE.image}
                alt={USER_PROFILE.name}
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-orange-500 text-white p-1 rounded-full">
                <SettingsIcon size={16} />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {USER_PROFILE.name}
              </h1>
              <p className="text-gray-500 text-sm">
                Bergabung {USER_PROFILE.joinDate}
              </p>
            </div>
            <div className="flex gap-2">
              <Link 
                to="/edit-profile"
                className="px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
              >
                Edit Profil
              </Link>
              <button className="p-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                <LogOutIcon size={18} />
              </button>
            </div>
          </div>
          <p className="text-gray-700 mb-4">{USER_PROFILE.bio}</p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center text-gray-600">
              <span className="font-medium text-gray-900 mr-1">
                {USER_PROFILE.recipes}
              </span>{' '}
              Resep
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-medium text-gray-900 mr-1">
                {USER_PROFILE.followers}
              </span>{' '}
              Pengikut
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-medium text-gray-900 mr-1">
                {USER_PROFILE.following}
              </span>{' '}
              Mengikuti
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex overflow-x-auto">
          <button
            className={`py-3 px-6 border-b-2 font-medium text-sm ${activeTab === 'recipes' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('recipes')}
          >
            Resep Saya
          </button>
          <button
            className={`py-3 px-6 border-b-2 font-medium text-sm ${activeTab === 'saved' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {USER_RECIPES.map((recipe) => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>
          </>
        )}
        {activeTab === 'saved' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Resep Tersimpan
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SAVED_RECIPES.map((recipe) => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
