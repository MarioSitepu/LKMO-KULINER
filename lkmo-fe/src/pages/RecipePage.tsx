import { useState } from 'react'
import {
  StarIcon,
  ClockIcon,
  UtensilsIcon,
  BookmarkIcon,
} from 'lucide-react'

const MOCK_RECIPE = {
  id: '1',
  title: 'Telur Dadar Mie Instan',
  image:
    'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  rating: 4.7,
  prepTime: '15 menit',
  equipment: ['Kompor Portable', 'Wajan'],
  author: {
    name: 'Budi Santoso',
    image:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  date: '12 April 2023',
  ingredients: [
    '1 bungkus mie instan',
    '2 butir telur',
    '1 batang daun bawang, iris halus',
    '1 sdm minyak goreng',
    'Bumbu mie instan',
  ],
  steps: [
    'Rebus mie hingga setengah matang, angkat dan tiriskan',
    'Kocok telur dalam mangkuk, masukkan mie dan bumbu mie instan',
    'Tambahkan daun bawang dan aduk hingga rata',
    'Panaskan minyak di wajan, tuang adonan mie telur',
    'Masak dengan api kecil hingga bagian bawah matang dan kecoklatan',
    'Balik telur dadar dan masak sisi lainnya hingga matang',
    'Angkat dan sajikan selagi hangat',
  ],
  comments: [
    {
      user: 'Siti Aminah',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      comment:
        'Resepnya mantap! Aku tambahin sedikit saus sambal jadi lebih enak.',
      date: '14 April 2023',
    },
    {
      user: 'Andi Wijaya',
      image:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      comment: 'Simple dan enak! Cocok banget buat sarapan.',
      date: '15 April 2023',
    },
  ],
}

export default function RecipePage() {
  const recipe = MOCK_RECIPE // In a real app, you'd fetch the recipe based on the ID
  const [isSaved, setIsSaved] = useState(false)
  
  const toggleSave = () => {
    setIsSaved(!isSaved)
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Recipe Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold text-gray-800 flex-1">
            {recipe.title}
          </h1>
          <button
            onClick={toggleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isSaved
                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-500 hover:text-orange-500'
            }`}
            title={isSaved ? 'Hapus dari tersimpan' : 'Simpan resep'}
          >
            <BookmarkIcon
              size={20}
              className={isSaved ? 'fill-current' : ''}
            />
            <span className="hidden sm:inline">
              {isSaved ? 'Tersimpan' : 'Simpan'}
            </span>
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center">
            <StarIcon
              size={18}
              className="text-yellow-400 fill-yellow-400 mr-1"
            />
            <span>{recipe.rating.toFixed(1)} (24 ulasan)</span>
          </div>
          <div className="flex items-center">
            <ClockIcon size={18} className="mr-1" />
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center">
            <UtensilsIcon size={18} className="mr-1" />
            <span>{recipe.equipment.join(', ')}</span>
          </div>
        </div>
        {/* Author info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img
              src={recipe.author.image}
              alt={recipe.author.name}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <div>
              <p className="font-medium">{recipe.author.name}</p>
              <p className="text-sm text-gray-500">{recipe.date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Image */}
      <div className="rounded-xl overflow-hidden mb-8">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Recipe Content */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Bahan-bahan</h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-3 bg-orange-500 rounded-full"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Steps */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Cara Pembuatan</h2>
            <ol className="space-y-6">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-500 font-bold rounded-full">
                      {index + 1}
                    </div>
                  </div>
                  <p className="pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">
          Ulasan ({recipe.comments.length})
        </h2>
        
        {/* Comment Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-medium mb-4">Tambahkan Ulasan</h3>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="mr-2">Rating:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    size={20}
                    className="text-gray-300 cursor-pointer hover:text-yellow-400"
                  />
                ))}
              </div>
            </div>
          </div>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-orange-500 focus:border-orange-500"
            rows={3}
            placeholder="Bagikan pengalaman memasak resep ini..."
          ></textarea>
          <button className="px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors">
            Kirim Ulasan
          </button>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {recipe.comments.map((comment, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <img
                  src={comment.image}
                  alt={comment.user}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">{comment.user}</h4>
                    <span className="text-sm text-gray-500">
                      {comment.date}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
