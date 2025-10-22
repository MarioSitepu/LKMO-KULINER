import { PlusIcon, XIcon } from 'lucide-react'

export default function UploadRecipePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Upload Resep Baru
      </h1>
      <p className="text-gray-600 mb-8">
        Bagikan resep favoritmu yang sederhana dan lezat dengan komunitas anak
        kos!
      </p>

      <form className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-6">Informasi Dasar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Judul Resep*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Contoh: Telur Dadar Mie Instan"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Kategori*
              </label>
              <select
                id="category"
                name="category"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
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
                  name="prepTime"
                  min="1"
                  placeholder="15"
                  className="w-full p-3 border border-gray-300 rounded-l-md focus:ring-orange-500 focus:border-orange-500"
                  required
                />
                <span className="inline-flex items-center px-4 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-500">
                  menit
                </span>
              </div>
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
              name="image"
              className="hidden"
              accept="image/*"
            />
            <label htmlFor="image" className="cursor-pointer">
              <div className="space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <PlusIcon size={24} className="text-orange-500" />
                </div>
                <div className="text-gray-700 font-medium">
                  Klik untuk mengunggah foto
                </div>
                <p className="text-sm text-gray-500">
                  PNG, JPG atau JPEG (maks. 5MB)
                </p>
              </div>
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
                'Kompor Portable',
                'Wajan',
                'Panci',
                'Oven',
                'Blender',
              ].map((item) => (
                <label
                  key={item}
                  className="inline-flex items-center p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-orange-50"
                >
                  <input
                    type="checkbox"
                    className="mr-2 text-orange-500 focus:ring-orange-500"
                    name="equipment"
                    value={item}
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
                name="other-equipment"
                placeholder="Pisahkan dengan koma (contoh: pisau, talenan)"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-6">Bahan-bahan</h2>
          <div className="space-y-4" id="ingredients-container">
            <div className="flex gap-2">
              <input
                type="text"
                name="ingredients[]"
                placeholder="Contoh: 2 butir telur"
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
              />
              <button
                type="button"
                className="p-3 text-gray-400 hover:text-gray-600"
              >
                <XIcon size={20} />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                name="ingredients[]"
                placeholder="Contoh: 1 bungkus mie instan"
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
              />
              <button
                type="button"
                className="p-3 text-gray-400 hover:text-gray-600"
              >
                <XIcon size={20} />
              </button>
            </div>
          </div>
          <button
            type="button"
            className="mt-4 flex items-center text-sm text-orange-500 font-medium"
          >
            <PlusIcon size={16} className="mr-1" />
            Tambah Bahan
          </button>
        </div>

        {/* Steps */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-6">Cara Pembuatan</h2>
          <div className="space-y-4" id="steps-container">
            <div className="flex gap-2">
              <div className="flex-shrink-0 pt-3">
                <div className="flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-500 font-medium rounded-full">
                  1
                </div>
              </div>
              <div className="flex-1">
                <textarea
                  name="steps[]"
                  rows={2}
                  placeholder="Jelaskan langkah pertama..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  required
                ></textarea>
              </div>
              <button
                type="button"
                className="p-3 text-gray-400 hover:text-gray-600"
              >
                <XIcon size={20} />
              </button>
            </div>
            <div className="flex gap-2">
              <div className="flex-shrink-0 pt-3">
                <div className="flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-500 font-medium rounded-full">
                  2
                </div>
              </div>
              <div className="flex-1">
                <textarea
                  name="steps[]"
                  rows={2}
                  placeholder="Jelaskan langkah kedua..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  required
                ></textarea>
              </div>
              <button
                type="button"
                className="p-3 text-gray-400 hover:text-gray-600"
              >
                <XIcon size={20} />
              </button>
            </div>
          </div>
          <button
            type="button"
            className="mt-4 flex items-center text-sm text-orange-500 font-medium"
          >
            <PlusIcon size={16} className="mr-1" />
            Tambah Langkah
          </button>
        </div>

        {/* Harga */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-6">Perkiraan Harga</h2>
          <div className="space-y-4" id="steps-container">
            <div className="flex gap-2">
              <div className="flex-shrink-0 pt-3">
              </div>
              <div className="flex-1">
                <input
                type="text"
                name="ingredients[]"
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
              />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-shrink-0 pt-3">
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
          >
            Simpan Draft
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
          >
            Publikasikan Resep
          </button>
        </div>
      </form>
    </div>
  )
}
