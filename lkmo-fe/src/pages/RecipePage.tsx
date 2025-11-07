import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  StarIcon,
  ClockIcon,
  UtensilsIcon,
  BookmarkIcon,
  DollarSignIcon,
} from 'lucide-react'
import { recipeAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { getImageUrl } from '../utils/imageUtils'

interface Review {
  _id?: string
  user: {
    _id?: string
    name: string
    image?: string | null
  }
  rating: number
  comment: string
  createdAt?: string
}

interface Recipe {
  _id?: string
  id?: string
  title: string
  image?: string | null
  category: string
  prepTime: number
  equipment: string[]
  ingredients: string[]
  steps: string[]
  price?: string
  rating: number
  ratingsCount: number
  author: {
    _id?: string
    name: string
    image?: string | null
    bio?: string
    location?: string
  }
  createdAt?: string
  isSaved?: boolean
  userReview?: Review | null
}

export default function RecipePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    if (id) {
      loadRecipe()
    }
  }, [id])

  const loadRecipe = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await recipeAPI.getById(id!)
      if (response.success && response.data?.recipe) {
        const recipeData = response.data.recipe
        setRecipe(recipeData)
        setIsSaved(recipeData.isSaved || false)
        
        // Load reviews
        if (response.data.reviews) {
          setReviews(response.data.reviews)
        }
        
        // Load user's existing review if exists
        if (recipeData.userReview) {
          setRating(recipeData.userReview.rating)
          setComment(recipeData.userReview.comment)
        }
      } else {
        setError('Resep tidak ditemukan')
      }
    } catch (err: any) {
      console.error('Error loading recipe:', err)
      setError(err.response?.data?.message || 'Gagal memuat resep')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    if (!rating || rating < 1 || rating > 5) {
      alert('Pilih rating terlebih dahulu (1-5)')
      return
    }
    
    if (!comment.trim()) {
      alert('Komentar harus diisi')
      return
    }
    
    try {
      setSubmittingReview(true)
      const response = await recipeAPI.addReview(id!, { rating, comment: comment.trim() })
      
      if (response.success) {
        // Reload recipe to get updated rating and reviews
        await loadRecipe()
        alert(response.message || 'Ulasan berhasil ditambahkan')
      }
    } catch (err: any) {
      console.error('Error submitting review:', err)
      alert(err.response?.data?.message || 'Gagal menambahkan ulasan')
    } finally {
      setSubmittingReview(false)
    }
  }
  
  const handleStarClick = (value: number) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setRating(value)
  }

  const toggleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      await recipeAPI.save(id!)
      setIsSaved(!isSaved)
    } catch (err: any) {
      console.error('Error saving recipe:', err)
      alert(err.response?.data?.message || 'Gagal menyimpan resep')
    }
  }


  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric' 
    })
  }

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      breakfast: 'Sarapan',
      lunch: 'Makan Siang',
      dinner: 'Makan Malam',
      snack: 'Camilan'
    }
    return categories[category] || category
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-500">Memuat resep...</div>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">{error || 'Resep tidak ditemukan'}</div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
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
                ? 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-500 hover:text-green-500'
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
            <span>
              {recipe.rating > 0 ? recipe.rating.toFixed(1) : 'Belum ada rating'} 
              {recipe.ratingsCount > 0 && ` (${recipe.ratingsCount} ulasan)`}
            </span>
          </div>
          <div className="flex items-center">
            <ClockIcon size={18} className="mr-1" />
            <span>{recipe.prepTime} menit</span>
          </div>
          <div className="flex items-center">
            <UtensilsIcon size={18} className="mr-1" />
            <span>
              {recipe.equipment && recipe.equipment.length > 0 
                ? recipe.equipment.join(', ') 
                : 'Tidak ada peralatan'}
            </span>
          </div>
          {recipe.price && (
            <div className="flex items-center">
              <DollarSignIcon size={18} className="mr-1" />
              <span>{recipe.price}</span>
            </div>
          )}
          <div className="flex items-center">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
              {getCategoryName(recipe.category)}
            </span>
          </div>
        </div>
        {/* Author info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img
              src={getImageUrl(recipe.author.image)}
              alt={recipe.author.name}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <div>
              <p className="font-medium">{recipe.author.name}</p>
              {recipe.createdAt && (
                <p className="text-sm text-gray-500">{formatDate(recipe.createdAt)}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Image */}
      {recipe.image && (
        <div className="rounded-xl overflow-hidden mb-8">
          <img
            src={getImageUrl(recipe.image)}
            alt={recipe.title}
            className="w-full h-auto max-h-96 object-cover"
          />
        </div>
      )}

      {/* Recipe Content */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Bahan-bahan</h2>
            <ul className="space-y-3">
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 mt-2 mr-3 bg-green-500 rounded-full"></span>
                    <span>{ingredient}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Tidak ada bahan yang ditambahkan</li>
              )}
            </ul>
          </div>
        </div>

        {/* Steps */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Cara Pembuatan</h2>
            <ol className="space-y-6">
              {recipe.steps && recipe.steps.length > 0 ? (
                recipe.steps.map((step, index) => (
                  <li key={index} className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-500 font-bold rounded-full">
                        {index + 1}
                      </div>
                    </div>
                    <p className="pt-1">{step}</p>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Tidak ada langkah yang ditambahkan</li>
              )}
            </ol>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">
          Ulasan ({reviews.length})
        </h2>
        
        {/* Comment Form */}
        {isAuthenticated && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h3 className="text-lg font-medium mb-4">
              {recipe.userReview ? 'Edit Ulasan Anda' : 'Tambahkan Ulasan'}
            </h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="focus:outline-none"
                    >
                      <StarIcon
                        size={32}
                        className={`${
                          star <= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        } transition-colors hover:text-yellow-400`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm text-gray-600">
                      ({rating}/5)
                    </span>
                  )}
                </div>
                {rating === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Pilih rating terlebih dahulu
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Komentar <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  rows={4}
                  placeholder="Bagikan pengalaman memasak resep ini..."
                  maxLength={500}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {comment.length}/500 karakter
                </p>
              </div>
              <button
                type="submit"
                disabled={submittingReview || !rating || !comment.trim()}
                className="px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReview ? 'Mengirim...' : recipe.userReview ? 'Update Ulasan' : 'Kirim Ulasan'}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                * Rating dan komentar harus diisi
              </p>
            </form>
          </div>
        )}
        
        {!isAuthenticated && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              Silakan <button onClick={() => navigate('/login')} className="underline font-medium">login</button> untuk menambahkan ulasan
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">Belum ada ulasan. Jadilah yang pertama memberikan ulasan!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <img
                    src={getImageUrl(review.user.image)}
                    alt={review.user.name}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-800">{review.user.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              size={16}
                              className={`${
                                star <= review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.createdAt && (
                        <span className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}
