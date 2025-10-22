import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CameraIcon } from 'lucide-react'

export default function EditProfilePage() {
  const navigate = useNavigate()

  // Data awal profil
  const [profile, setProfile] = useState({
    name: 'Budi Santoso',
    bio: 'Mahasiswa teknik informatika hobi masak makanan simpel',
    image:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop',
  })

  const [preview, setPreview] = useState<string | null>(null)


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()

      
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreview(reader.result)
        }
      }

      reader.readAsDataURL(file)
    }
  }


  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Data tersimpan:', profile)
  }

  return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4">
        <ArrowLeft size={18} /> Kembali
      </button>

      <form onSubmit={handleSave}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={preview || profile.image}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <label
              htmlFor="upload"
              className="absolute bottom-0 right-0 bg-gray-700 text-white p-1 rounded-full cursor-pointer"
            >
              <CameraIcon size={16} />
            </label>
            <input
              id="upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="border p-2 rounded w-64"
          />

          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="border p-2 rounded w-64 h-24"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  )
}
