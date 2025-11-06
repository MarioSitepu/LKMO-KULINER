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

  // Log untuk debugging (hanya di development atau jika VITE_API_URL tidak di-set)
  if (import.meta.env.DEV) {
    console.log('🖼️ Image URL Debug:', {
      image,
      imagePath,
      viteApiUrl: import.meta.env.VITE_API_URL,
      baseUrlBefore: baseUrl,
      mode: import.meta.env.MODE
    })
  }

  // Normalize: hapus trailing slash
  baseUrl = baseUrl.replace(/\/$/, '')

  // Untuk file statis, kita perlu menghapus /api dari akhir URL
  // karena file statis disajikan langsung di /uploads (bukan /api/uploads)
  if (baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.replace(/\/api$/, '')
  }

  // Gabungkan base URL dengan path gambar
  const finalUrl = `${baseUrl}${imagePath}`

  // Warning jika masih menggunakan localhost di production
  if (import.meta.env.MODE === 'production' && baseUrl.includes('localhost')) {
    console.error('❌ ERROR: VITE_API_URL tidak di-set di production!')
    console.error('📋 Solusi: Set VITE_API_URL di Vercel Dashboard → Settings → Environment Variables')
    console.error('📋 Format: https://your-backend-name.onrender.com/api')
    console.error('🖼️ Current Image URL:', finalUrl)
  }

  // Log final URL hanya di development
  if (import.meta.env.DEV) {
    console.log('🖼️ Final Image URL:', finalUrl)
  }

  return finalUrl
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

  // Warning jika masih menggunakan localhost di production
  if (import.meta.env.MODE === 'production' && baseUrl.includes('localhost')) {
    console.error('❌ ERROR: VITE_API_URL tidak di-set di production!')
  }

  return `${baseUrl}${imagePath}`
}

