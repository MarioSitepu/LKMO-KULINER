// src/pages/SearchPage.tsx

import { useState } from 'react'
import {
  SearchIcon,
  FilterIcon,
  XIcon,
  CookingPotIcon,
  PlusIcon,
} from 'lucide-react'
import RecipeCard from '../components/RecipeCard'

// SAYA GUNAKAN MOCK DATA DARI FILE LAIN UNTUK CONTOH HASIL
const MOCK_RESULTS = [
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
]

// Untuk mengetes, ganti MOCK_RESULTS dengan baris ini:
// const MOCK_RESULTS: any[] = []

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(true)

  const results = MOCK_RESULTS

  return (
    <div className="max-w-6xl mx-auto">
      {/* 1. Search Bar Utama */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Cari Resep, Bahan Makanan, dll"
          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="absolute inset-y-0 left-0 flex items-center pl-4">
          <SearchIcon size={24} className="text-gray-400" />
        </span>
      </div>

      {/* === PERUBAHAN DI SINI === */}
      {/* Tata letak grid diubah agar main di kiri dan aside di kanan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* 2. Kolom Hasil Pencarian (Sekarang di Kiri) */}
        <main className="md:col-span-3">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Hasil Pencarian {searchTerm && `untuk "${searchTerm}"`} (
            {results.length})
          </h2>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((recipe) => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>
          ) : (
            // Tampilan "Tidak Ditemukan"
            <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
              <div className="flex justify-center mb-4">
                <CookingPotIcon size={48} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Tidak dapat menemukan resep?
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Jadilah yang pertama membagikannya. Yuk ikut berbagi resep dan
                bantu pengguna lainnya!
              </p>
              <a
                href="/upload"
                className="inline-block px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
              >
                <PlusIcon size={18} className="inline-block -mt-1 mr-2" />
                Tulis Resep
              </a>
            </div>
          )}
        </main>

        {/* 3. Kolom Filter (Sekarang di Kanan) */}
        <aside className="md:col-span-1">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FilterIcon size={20} className="mr-2" />
              Filter
            </h2>
            <button
              className="md:hidden p-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? <XIcon size={20} /> : <FilterIcon size={20} />}
            </button>
          </div>
          {/* Kontainer Filter */}
          <div
            className={`${
              showFilters ? 'block' : 'hidden'
            } md:block bg-white p-6 rounded-lg shadow-sm space-y-6`}
          >
            {/* Filter Kategori */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Kategori</h3>
              <div className="space-y-2">
                {[
                  'Sarapan',
                  'Makan Siang',
                  'Makan Malam',
                  'Camilan',
                ].map((cat) => (
                  <label key={cat} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-600">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Harga */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Harga</h3>
              <div className="space-y-2">
                {[
                  '< Rp 10.000',
                  'Rp 10.000 - Rp 25.000',
                  '> Rp 25.000',
                ].map((price) => (
                  <label key={price} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-600">{price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Peralatan */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Peralatan</h3>
              <div className="space-y-2">
                {['Rice Cooker', 'Microwave', 'Kompor', 'Panci Rebus'].map(
                  (eq) => (
                    <label key={eq} className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="ml-3 text-gray-600">{eq}</span>
                    </label>
                  ),
                )}
              </div>
            </div>

            <button className="w-full py-2 px-4 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors">
              Terapkan Filter
            </button>
          </div>
        </aside>
        
      </div>
    </div>
  )
}