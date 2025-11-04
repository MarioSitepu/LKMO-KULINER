import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CameraIcon } from 'lucide-react'
import { userAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    location: '',
    image: null as File | null,
  })
  
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // Load current user data
    if (user) {
      setProfile({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        image: null,
      })
      if (user.image) {
        let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        // Remove /api from end if present (for static files)
        if (baseUrl.endsWith('/api')) {
          baseUrl = baseUrl.replace(/\/api$/, '')
        }
        setPreview(user.image.startsWith('http') ? user.image : `${baseUrl}${user.image}`)
      }
    }
  }, [user, isAuthenticated, navigate])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfile({ ...profile, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreview(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', profile.name)
      formData.append('bio', profile.bio)
      formData.append('location', profile.location)
      
      if (profile.image) {
        formData.append('image', profile.image)
      }

      await userAPI.updateProfile(formData)
      setSuccess('Profil berhasil diupdate')
      
      // Reload user data
      setTimeout(() => {
        navigate('/profile')
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal update profil. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft size={18} /> Kembali
      </button>

      <h1 className="text-2xl font-bold mb-6">Edit Profil</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <img
              src={preview || '/placeholder-avatar.png'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
            <label
              htmlFor="upload"
              className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 shadow-md"
            >
              <CameraIcon size={18} />
            </label>
            <input
              id="upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="w-full space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ceritakan tentang dirimu..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="Contoh: Jakarta, Indonesia"
              />
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
