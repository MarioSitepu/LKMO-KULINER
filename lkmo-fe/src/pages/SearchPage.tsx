// src/pages/SearchPage.tsx

import { useState, type KeyboardEvent, useEffect } from 'react'
import {
  SearchIcon,
  FilterIcon,
  XIcon,
  CookingPotIcon,
  PlusIcon,
} from 'lucide-react'
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

// Mapping untuk kategori
const CATEGORY_MAP: Record<string, string> = {
  'Sarapan': 'breakfast',
  'Makan Siang': 'lunch',
  'Makan Malam': 'dinner',
  'Camilan': 'snack',
}

// Mapping untuk harga
const PRICE_MAP: Record<string, string> = {
  '< Rp 10.000': 'under-10000',
  'Rp 10.000 - Rp 25.000': '10000-25000',
  '> Rp 25.000': 'over-25000',
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchedKeyword, setSearchedKeyword] = useState('') // Keyword yang digunakan untuk pencarian terakhir
  const [showFilters, setShowFilters] = useState(true)
  const [results, setResults] = useState<Recipe[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // State untuk filter radio
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedPrice, setSelectedPrice] = useState<string>('')
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])

  // Fungsi untuk menjalankan pencarian dengan filter
  const handleSearch = async () => {
    // Jika tidak ada keyword dan tidak ada filter yang dipilih, jangan lakukan pencarian
    if (searchTerm.trim() === '' && !selectedCategory && !selectedPrice && selectedEquipment.length === 0) {
      setResults(null)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Build API parameters
      const params: {
        search?: string
        category?: string
        priceRange?: string
        equipment?: string
        limit?: number
      } = {
        limit: 100
      }

      if (searchTerm.trim()) {
        params.search = searchTerm.trim()
      }

      if (selectedCategory) {
        params.category = CATEGORY_MAP[selectedCategory]
      }

      if (selectedPrice) {
        params.priceRange = PRICE_MAP[selectedPrice]
      }

      if (selectedEquipment.length > 0) {
        params.equipment = selectedEquipment.join(',')
      }

      const response = await recipeAPI.getAll(params)

      if (response.success && response.data?.recipes) {
        setResults(response.data.recipes)
        // Simpan keyword yang digunakan untuk pencarian
        setSearchedKeyword(searchTerm.trim())
      } else {
        setResults([])
        setSearchedKeyword(searchTerm.trim())
      }
    } catch (err: any) {
      console.error('Error searching recipes:', err)
      setError(err.response?.data?.message || 'Gagal mencari resep')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Fungsi untuk menangani penekanan tombol 'Enter'
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Auto search ketika filter berubah (tanpa keyword)
  useEffect(() => {
    // Hanya jalankan jika ada filter yang dipilih tapi tidak ada keyword
    // Jika ada keyword, biarkan user yang trigger dengan Enter atau button
    if (!searchTerm.trim() && (selectedCategory || selectedPrice || selectedEquipment.length > 0)) {
      handleSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedPrice, selectedEquipment])

  // Reset filter
  const resetFilters = () => {
    setSelectedCategory('')
    setSelectedPrice('')
    setSelectedEquipment([])
    setResults(null)
  }


  return (
    <div className="max-w-6xl mx-auto">
      {/* 1. Search Bar Utama */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Cari Resep, Bahan Makanan, dll"
          className="w-full pl-12 pr-24 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <span className="absolute inset-y-0 left-0 flex items-center pl-4">
          <SearchIcon size={24} className="text-gray-400" />
        </span>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="absolute inset-y-0 right-0 flex items-center px-6 bg-orange-500 text-white font-medium rounded-r-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
        >
          Cari
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* 2. Kolom Hasil Pencarian (Kiri) */}
        <main className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {/* Judul dinamis berdasarkan status pencarian */}
              {loading
                ? 'Mencari Resep...'
                : results === null
                ? 'Filter Resep'
                : searchedKeyword
                ? `Hasil Pencarian "${searchedKeyword}"`
                : selectedCategory || selectedPrice || selectedEquipment.length > 0
                ? 'Hasil Filter'
                : 'Filter Resep'}
              {results !== null && !loading && ` (${results.length})`}
            </h2>
            {(selectedCategory || selectedPrice || selectedEquipment.length > 0 || searchedKeyword) && (
              <button
                onClick={() => {
                  resetFilters()
                  setSearchTerm('')
                  setSearchedKeyword('')
                }}
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
              <div className="text-gray-500">Memuat hasil pencarian...</div>
            </div>
          )}

          {/* State 1: Belum mencari (results === null) */}
          {!loading && results === null && (
            <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
              <div className="flex justify-center mb-4">
                <SearchIcon size={48} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Mulai Mencari Resep
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Ketik di kotak pencarian atau pilih filter untuk menemukan resep yang Anda inginkan.
              </p>
            </div>
          )}

          {/* State 2: Ada hasil (results.length > 0) */}
          {!loading && results !== null && results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  id={recipe._id}
                  title={recipe.title}
                  image={getImageUrl(recipe.image)}
                  rating={recipe.rating || 0}
                  prepTime={`${recipe.prepTime} menit`}
                  equipment={recipe.equipment || []}
                  author={recipe.author?.name || 'Unknown'}
                  price={recipe.price || 'Rp 0'}
                />
              ))}
            </div>
          )}

          {/* State 3: Tidak ada hasil (results.length === 0) */}
          {!loading && results !== null && results.length === 0 && (
            <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
              <div className="flex justify-center mb-4">
                <CookingPotIcon size={48} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Hasil Penelusuran Tersebut Tidak Ada
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {searchedKeyword 
                  ? `Maaf, kami tidak dapat menemukan resep untuk "${searchedKeyword}".`
                  : 'Maaf, kami tidak dapat menemukan resep yang sesuai dengan kriteria Anda.'}
                Coba filter lain atau...
              </p>
              <a
                href="/upload"
                className="inline-block px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
              >
                <PlusIcon size={18} className="inline-block -mt-1 mr-2" />
                Jadilah yang Pertama Menulis Resep
              </a>
            </div>
          )}
        </main>

        {/* 3. Kolom Filter (Kanan) */}
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
            {/* Filter Waktu Makan */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Waktu Makan</h3>
              <div className="space-y-2">
                {[
                  'Sarapan',
                  'Makan Siang',
                  'Makan Malam',
                  'Camilan',
                ].map((cat) => (
                  <label key={cat} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={selectedCategory === cat}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value)
                      }}
                      className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-600">{cat}</span>
                  </label>
                ))}
                {selectedCategory && (
                  <button
                    onClick={() => {
                      setSelectedCategory('')
                    }}
                    className="text-xs text-orange-500 hover:text-orange-600 mt-1"
                  >
                    Hapus filter
                  </button>
                )}
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
                  <label key={price} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value={price}
                      checked={selectedPrice === price}
                      onChange={(e) => {
                        setSelectedPrice(e.target.value)
                      }}
                      className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-600">{price}</span>
                  </label>
                ))}
                {selectedPrice && (
                  <button
                    onClick={() => {
                      setSelectedPrice('')
                    }}
                    className="text-xs text-orange-500 hover:text-orange-600 mt-1"
                  >
                    Hapus filter
                  </button>
                )}
              </div>
            </div>

            {/* Filter Peralatan */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Peralatan</h3>
              <div className="space-y-2">
                {[
                  { label: 'Rice Cooker', value: 'Rice Cooker' },
                  { label: 'Microwave', value: 'Microwave' },
                  { label: 'Kompor', value: 'Kompor' },
                  { label: 'Wajan', value: 'Wajan' },
                  { label: 'Panci rebus', value: 'Panci rebus' },
                  { label: 'Lainnya', value: 'other' },
                ].map((eq) => (
                  <label key={eq.value} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="equipment"
                      value={eq.value}
                      checked={selectedEquipment.includes(eq.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEquipment([...selectedEquipment, eq.value])
                        } else {
                          setSelectedEquipment(selectedEquipment.filter(item => item !== eq.value))
                        }
                      }}
                      className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500 rounded"
                    />
                    <span className="ml-3 text-gray-600">{eq.label}</span>
                  </label>
                ))}
                {selectedEquipment.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedEquipment([])
                    }}
                    className="text-xs text-orange-500 hover:text-orange-600 mt-1"
                  >
                    Hapus filter
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}