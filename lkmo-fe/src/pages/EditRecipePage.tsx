import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PlusIcon, XIcon } from 'lucide-react'
import { recipeAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { getImageUrl, getLegacyApiImageUrl } from '../utils/imageUtils'
import defaultRecipeImage from '../assets/default-recipe.svg'

const MAIN_EQUIPMENT = ['Rice Cooker', 'Microwave', 'Kompor', 'Wajan', 'Panci rebus']

interface FormState {
  title: string
  category: string
  prepTime: string
  priceValue: string
  priceThousands: string
  image: File | null
  equipment: string[]
  otherEquipment: string
  ingredients: string[]
  steps: string[]
}

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loadingRecipe, setLoadingRecipe] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormState>({
    title: '',
    category: '',
    prepTime: '',
    priceValue: '',
    priceThousands: '',
    image: null,
    equipment: [],
    otherEquipment: '',
    ingredients: [''],
    steps: [''],
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [existingImage, setExistingImage] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      navigate('/profile')
      return
    }
    const currentUserId = user?.id || (user as any)?._id
    if (!currentUserId) {
      // Menunggu data user dari context (sudah dijaga oleh ProtectedRoute, tapi berjaga-jaga)
      return
    }
    void loadRecipe(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.id])

  const loadRecipe = async (recipeId: string) => {
    try {
      setLoadingRecipe(true)
      setError(null)

      const response = await recipeAPI.getById(recipeId)
      if (!response.success || !response.data?.recipe) {
        throw new Error(response.message || 'Resep tidak ditemukan')
      }

      const recipe = response.data.recipe
      const currentUserId = user?.id || (user as any)?._id
      const authorId = recipe.author?._id || recipe.author?.id

      if (!currentUserId || !authorId || authorId.toString() !== currentUserId.toString()) {
        setError('Anda tidak memiliki izin untuk mengedit resep ini')
        return
      }

      const equipmentList: string[] = recipe.equipment || []
      const selectedMainEquipment = equipmentList.filter((item) => MAIN_EQUIPMENT.includes(item))
      const otherEquipments = equipmentList.filter((item) => !MAIN_EQUIPMENT.includes(item))

      const parsedPrice = parsePrice(recipe.price)
      const ingredients = recipe.ingredients?.length ? recipe.ingredients : ['']
      const steps = recipe.steps?.length ? recipe.steps : ['']

      setFormData({
        title: recipe.title || '',
        category: recipe.category || '',
        prepTime: recipe.prepTime ? String(recipe.prepTime) : '',
        priceValue: parsedPrice.priceValue,
        priceThousands: parsedPrice.priceThousands,
        image: null,
        equipment: selectedMainEquipment,
        otherEquipment: otherEquipments.join(', '),
        ingredients,
        steps,
      })

      const previewUrl = recipe.image
        ? getImageUrl(recipe.image, defaultRecipeImage)
        : null
      setExistingImage(recipe.image || null)
      setImagePreview(previewUrl)
    } catch (err: any) {
      console.error('Error loading recipe for edit:', err)
      setError(err.response?.data?.message || err.message || 'Gagal memuat resep')
    } finally {
      setLoadingRecipe(false)
    }
  }

  const parsePrice = (price?: string | null) => {
    if (!price) {
      return { priceValue: '', priceThousands: '' }
    }

    const cleaned = price.replace(/rp\s*/i, '').trim()
    if (!cleaned) {
      return { priceValue: '', priceThousands: '' }
    }

    const parts = cleaned.split(/[.,]/).map((part) => part.replace(/[^\d]/g, ''))
    if (parts.length === 0 || !parts[0]) {
      return { priceValue: '', priceThousands: '' }
    }

    if (parts.length === 1) {
      return { priceValue: parts[0], priceThousands: '' }
    }

    const thousands = parts.slice(1).join('').slice(0, 3)
    return { priceValue: parts[0], priceThousands: thousands }
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEquipmentChange = (item: string, checked: boolean) => {
    setFormData((prev) => {
      const nextEquipment = checked
        ? [...prev.equipment, item]
        : prev.equipment.filter((eq) => eq !== item)

      return { ...prev, equipment: nextEquipment }
    })
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ''],
    }))
  }

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
  }

  const updateIngredient = (index: number, value: string) => {
    setFormData((prev) => {
      const ingredients = [...prev.ingredients]
      ingredients[index] = value
      return { ...prev, ingredients }
    })
  }

  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [...prev.steps, ''],
    }))
  }

  const removeStep = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }))
  }

  const updateStep = (index: number, value: string) => {
    setFormData((prev) => {
      const steps = [...prev.steps]
      steps[index] = value
      return { ...prev, steps }
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!id) return

    setError(null)
    setSubmitting(true)

    try {
      // Validasi basic fields
      if (!formData.title || !formData.category || !formData.prepTime) {
        throw new Error('Harap lengkapi semua field wajib')
      }

      const filteredIngredients = formData.ingredients
        .map((ing) => ing.trim())
        .filter((ing) => ing !== '')
      const filteredSteps = formData.steps
        .map((step) => step.trim())
        .filter((step) => step !== '')

      if (filteredIngredients.length === 0) {
        throw new Error('Minimal 1 bahan diperlukan')
      }

      if (filteredSteps.length === 0) {
        throw new Error('Minimal 1 langkah diperlukan')
      }

      let allEquipment = [...formData.equipment]
      if (formData.otherEquipment.trim()) {
        const others = formData.otherEquipment
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
        allEquipment = [...allEquipment, ...others]
      }

      // Hilangkan duplikasi dan kosong
      allEquipment = Array.from(new Set(allEquipment.filter((item) => item.trim().length > 0)))

      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('category', formData.category)
      submitData.append('prepTime', formData.prepTime)

      const priceFormatted = buildPriceValue(formData.priceValue, formData.priceThousands)
      submitData.append('price', priceFormatted)
      submitData.append('ingredients', JSON.stringify(filteredIngredients))
      submitData.append('steps', JSON.stringify(filteredSteps))

      submitData.append('equipment', JSON.stringify(allEquipment))

      if (formData.image) {
        submitData.append('image', formData.image)
      }

      const response = await recipeAPI.update(id, submitData)
      if (!response.success) {
        throw new Error(response.message || 'Gagal memperbarui resep')
      }

      const updatedRecipeId = response.data?.recipe?._id || response.data?.recipe?.id || id
      navigate(`/recipe/${updatedRecipeId}`)
    } catch (err: any) {
      console.error('Error updating recipe:', err)
      setError(err.response?.data?.message || err.message || 'Gagal memperbarui resep')
    } finally {
      setSubmitting(false)
    }
  }

  const buildPriceValue = (value: string, thousands: string) => {
    const cleanValue = value.replace(/[^\d]/g, '')
    const cleanThousands = thousands.replace(/[^\d]/g, '').slice(0, 3)

    if (!cleanValue) {
      return ''
    }

    if (!cleanThousands) {
      return `Rp ${cleanValue}`
    }

    const paddedThousands = cleanThousands.padEnd(3, '0').slice(0, 3)
    return `Rp ${cleanValue}.${paddedThousands}`
  }

  if (loadingRecipe) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-20 text-gray-500">Memuat data resep...</div>
      </div>
    )
  }

  if (error && !formData.title) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Kembali
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Edit Resep
      </h1>
      <p className="text-gray-600 mb-8">
        Update resep kamu agar tetap relevan dan membantu komunitas!
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
                  Kategori*
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
                      const value = e.target.value.replace(/[^\d]/g, '')
                      setFormData({ ...formData, priceValue: value })
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
                      const value = e.target.value.replace(/[^\d]/g, '').slice(0, 3)
                      setFormData({ ...formData, priceThousands: value })
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
            <label htmlFor="image" className="cursor-pointer block">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  data-legacy-src={existingImage ? getLegacyApiImageUrl(existingImage) || undefined : undefined}
                  alt="Preview"
                  className="mx-auto max-h-64 rounded-lg object-cover"
                  onError={(event) => {
                    const target = event.currentTarget
                    const legacySrc = target.dataset.legacySrc
                    if (legacySrc && !target.dataset.legacyTried) {
                      target.dataset.legacyTried = 'true'
                      target.src = legacySrc
                      return
                    }
                    target.onerror = null
                    target.src = defaultRecipeImage
                  }}
                />
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <PlusIcon size={24} className="text-green-500" />
                  </div>
                  <div className="text-gray-700 font-medium">
                    Klik untuk mengganti foto
                  </div>
                  <p className="text-sm text-gray-500">
                    PNG, JPG atau JPEG (maks. 5MB)
                  </p>
                </div>
              )}
            </label>
            {existingImage && !formData.image && (
              <p className="text-xs text-gray-500 mt-2">
                Foto saat ini akan tetap digunakan jika tidak mengganti gambar.
              </p>
            )}
          </div>
        </div>

        {/* Equipment */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-6">Peralatan yang Dibutuhkan</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {MAIN_EQUIPMENT.map((item) => (
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
                placeholder="Pisahkan dengan koma (contoh: pisau, talenan)"
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
                  required={index < 1}
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-3 text-gray-400 hover:text-red-600"
                    title="Hapus bahan"
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
                    required={index < 1}
                  />
                </div>
                {formData.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="p-3 text-gray-400 hover:text-red-600"
                    title="Hapus langkah"
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
            disabled={submitting}
            className="px-6 py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  )
}


