/**
 * Utility function untuk mendapatkan URL gambar yang benar
 * Menangani berbagai skenario: localhost, production, dan URL eksternal
 */
export const getImageUrl = (image: string | null | undefined, placeholder?: string): string => {
  // Jika tidak ada gambar, return placeholder
  if (!image) {
    return placeholder || 'https://via.placeholder.com/400x300?text=No+Image'
  }

  // Jika sudah URL lengkap (http/https), return langsung
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  // Pastikan path dimulai dengan /
  const imagePath = image.startsWith('/') ? image : `/${image}`

  // Ambil base URL dari environment variable
  let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // Normalize: hapus trailing slash
  baseUrl = baseUrl.replace(/\/$/, '')

  // Untuk file statis, kita perlu menghapus /api dari akhir URL
  // karena file statis disajikan langsung di /uploads (bukan /api/uploads)
  if (baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.replace(/\/api$/, '')
  }

  // Gabungkan base URL dengan path gambar
  return `${baseUrl}${imagePath}`
}

/**
 * Utility function khusus untuk gambar user (bisa return null)
 */
export const getUserImageUrl = (image: string | null | undefined): string | null => {
  if (!image) return null
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  const imagePath = image.startsWith('/') ? image : `/${image}`
  let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  baseUrl = baseUrl.replace(/\/$/, '')
  
  if (baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.replace(/\/api$/, '')
  }

  return `${baseUrl}${imagePath}`
}

