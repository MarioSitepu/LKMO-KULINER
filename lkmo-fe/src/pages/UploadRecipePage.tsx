import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusIcon, XIcon } from 'lucide-react'
import { recipeAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function UploadRecipePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    prepTime: '',
    priceValue: '', // Harga utama (wajib)
    priceThousands: '', // Ribuan (opsional)
    image: null as File | null,
    equipment: [] as string[],
    otherEquipment: '',
    ingredients: ['', ''],
    steps: ['', ''],
  })

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEquipmentChange = (item: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        equipment: [...formData.equipment, item],
      })
    } else {
      setFormData({
        ...formData,
        equipment: formData.equipment.filter((e) => e !== item),
      })
    }
  }

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ''],
    })
  }

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    })
  }

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients]
    newIngredients[index] = value
    setFormData({ ...formData, ingredients: newIngredients })
  }

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, ''],
    })
  }

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index),
    })
  }

  const updateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps]
    newSteps[index] = value
    setFormData({ ...formData, steps: newSteps })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate
      if (!formData.title || !formData.category || !formData.prepTime) {
        throw new Error('Harap lengkapi semua field wajib')
      }

      const filteredIngredients = formData.ingredients.filter((ing) => ing.trim() !== '')
      const filteredSteps = formData.steps.filter((step) => step.trim() !== '')

      if (filteredIngredients.length === 0) {
        throw new Error('Minimal 1 bahan diperlukan')
      }

      if (filteredSteps.length === 0) {
        throw new Error('Minimal 1 langkah diperlukan')
      }

      // Combine equipment
      let allEquipment = [...formData.equipment]
      if (formData.otherEquipment.trim()) {
        const other = formData.otherEquipment.split(',').map((e) => e.trim()).filter((e) => e)
        allEquipment = [...allEquipment, ...other]
      }

      // Create FormData
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('category', formData.category)
      submitData.append('prepTime', formData.prepTime)
      
      // Combine price value and thousands
      let priceFormatted = '';
      if (formData.priceValue.trim()) {
        const value = formData.priceValue.trim();
        const thousands = formData.priceThousands.trim();
        // Format: Rp 15.000 or Rp 15
        if (thousands) {
          // Pad thousands to 3 digits if less than 3
          const paddedThousands = thousands.padEnd(3, '0').slice(0, 3);
          priceFormatted = `Rp ${value}.${paddedThousands}`;
        } else {
          priceFormatted = `Rp ${value}`;
        }
      }
      submitData.append('price', priceFormatted)
      submitData.append('ingredients', JSON.stringify(filteredIngredients))
      submitData.append('steps', JSON.stringify(filteredSteps))
      
      if (allEquipment.length > 0) {
        submitData.append('equipment', JSON.stringify(allEquipment))
      }

      if (formData.image) {
        submitData.append('image', formData.image)
      }

      const response = await recipeAPI.create(submitData)
      
      // Get recipe ID from response and redirect to recipe detail page
      const recipeId = response?.data?.recipe?._id || response?.data?.recipe?.id
      
      if (recipeId) {
        navigate(`/recipe/${recipeId}`)
      } else {
        // Fallback to profile if ID not found (shouldn't happen, but just in case)
        console.error('Recipe ID not found in response:', response)
        navigate('/profile')
      }
    } catch (err: any) {
      setError(err.message || 'Gagal membuat resep. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Upload Resep Baru
      </h1>
      <p className="text-gray-600 mb-8">
        Bagikan resep favoritmu yang sederhana dan lezat dengan komunitas anak
        kos!
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-6">Informasi Dasar</h2>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Judul Resep*
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Telur Dadar Mie Instan"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                Waktu Makan*
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="breakfast">Sarapan</option>
                  <option value="lunch">Makan Siang</option>
                  <option value="dinner">Makan Malam</option>
                  <option value="snack">Camilan</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="prepTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Waktu Persiapan*
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="prepTime"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                    min="1"
                    placeholder="15"
                    className="flex-1 p-3 border border-gray-300 rounded-l-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                  <span className="inline-flex items-center px-3 md:px-4 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-500 text-sm md:text-base whitespace-nowrap">
                    menit
                  </span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perkiraan Harga
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
                <div className="flex items-center w-full sm:w-auto">
                  <span className="px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500 text-sm whitespace-nowrap">
                    Rp
                  </span>
                  <input
                    type="number"
                    id="priceValue"
                    value={formData.priceValue}
                    onChange={(e) => {
                      // Only allow numbers
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setFormData({ ...formData, priceValue: value });
                    }}
                    placeholder="15"
                    min="0"
                    className="flex-1 sm:w-24 p-3 border border-gray-300 rounded-r-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-gray-500 hidden sm:inline">.</span>
                  <input
                    type="text"
                    id="priceThousands"
                    value={formData.priceThousands}
                    onChange={(e) => {
                      // Only allow numbers, max 3 digits
                      const value = e.target.value.replace(/[^\d]/g, '').slice(0, 3);
                      setFormData({ ...formData, priceThousands: value });
                    }}
                    placeholder="000"
                    maxLength={3}
                    className="w-24 p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                    (ribuan - opsional)
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Contoh: 15 dan 000 = Rp 15.000, atau hanya 15 = Rp 15
              </p>
            </div>
          </div>
        </div>

        {/* Recipe Image */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-6">Foto Makanan</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label htmlFor="image" className="cursor-pointer">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto max-h-64 rounded-lg"
                />
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <PlusIcon size={24} className="text-green-500" />
                  </div>
                  <div className="text-gray-700 font-medium">
                    Klik untuk mengunggah foto
                  </div>
                  <p className="text-sm text-gray-500">
                    PNG, JPG atau JPEG (maks. 5MB)
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Equipment */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-6">Peralatan yang Dibutuhkan</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                'Rice Cooker',
                'Microwave',
                'Kompor',
                'Wajan',
                'Panci rebus',
              ].map((item) => (
                <label
                  key={item}
                  className="inline-flex items-center p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-green-50"
                >
                  <input
                    type="checkbox"
                    className="mr-2 text-green-500 focus:ring-green-500"
                    checked={formData.equipment.includes(item)}
                    onChange={(e) => handleEquipmentChange(item, e.target.checked)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            <div>
              <label
                htmlFor="other-equipment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Peralatan Lainnya
              </label>
              <input
                type="text"
                id="other-equipment"
                value={formData.otherEquipment}
                onChange={(e) => setFormData({ ...formData, otherEquipment: e.target.value })}
                placeholder="Gunakan koma untuk memisahkan setiap peralatan (contoh: pisau, talenan)"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-6">Bahan-bahan</h2>
          <div className="space-y-4">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder="Contoh: 2 butir telur"
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required={index < 2}
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-3 text-gray-400 hover:text-red-600"
                  >
                    <XIcon size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="mt-4 flex items-center text-sm text-green-500 font-medium"
            >
              <PlusIcon size={16} className="mr-1" />
              Tambah Bahan
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-6">Cara Pembuatan</h2>
          <div className="space-y-4">
            {formData.steps.map((step, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-shrink-0 pt-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-500 font-medium rounded-full">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    rows={2}
                    placeholder="Jelaskan langkah..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required={index < 2}
                  />
                </div>
                {formData.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="p-3 text-gray-400 hover:text-red-600"
                  >
                    <XIcon size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="mt-4 flex items-center text-sm text-green-500 font-medium"
            >
              <PlusIcon size={16} className="mr-1" />
              Tambah Langkah
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Menyimpan...' : 'Publikasikan Resep'}
          </button>
        </div>
      </form>
    </div>
  )
}
