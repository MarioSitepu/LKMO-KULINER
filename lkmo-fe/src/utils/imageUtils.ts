// Flag untuk log pertama kali di production
let hasLoggedImageUrlExample = false

/**
 * Utility function untuk mendapatkan URL gambar yang benar
 * Menangani berbagai skenario: localhost, production, dan URL eksternal
 */
interface BuildImageOptions {
  placeholder?: string
  keepApiSegment?: boolean
  allowNull?: boolean
}

const buildImageUrl = (
  image: string | null | undefined,
  { placeholder, keepApiSegment = false, allowNull = false }: BuildImageOptions = {},
): string | null => {
  if (!image) {
    if (allowNull) return null
    return placeholder || 'https://via.placeholder.com/400x300?text=No+Image'
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  const imagePath = image.startsWith('/') ? image : `/${image}`
  let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  if (import.meta.env.DEV || !import.meta.env.VITE_API_URL) {
    console.log('🖼️ Image URL Debug:', {
      image,
      imagePath,
      viteApiUrl: import.meta.env.VITE_API_URL,
      baseUrlBefore: baseUrl,
      mode: import.meta.env.MODE,
      keepApiSegment,
    })
  }

  baseUrl = baseUrl.replace(/\/$/, '')

  if (!keepApiSegment && baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.replace(/\/api$/, '')
  }

  const finalUrl = `${baseUrl}${imagePath}`

  if (import.meta.env.MODE === 'production' && baseUrl.includes('localhost')) {
    console.error('❌ ERROR: VITE_API_URL tidak di-set di production!')
    console.error('📋 Solusi: Set VITE_API_URL di Vercel Dashboard → Settings → Environment Variables')
    console.error('📋 Format: https://your-backend-name.onrender.com/api')
    console.error('🖼️ Current Image URL:', finalUrl)
  }

  if (import.meta.env.DEV) {
    console.log('🖼️ Final Image URL:', finalUrl)
  } else if (import.meta.env.MODE === 'production') {
    if (!hasLoggedImageUrlExample && image) {
      hasLoggedImageUrlExample = true
      console.log('🖼️ Image URL Example (first image):', finalUrl)
      console.log('💡 Tip: Jika gambar tidak muncul, test URL ini langsung di browser')
      console.log('💡 Pastikan backend menyajikan file statis di route /uploads')
    }
  }

  return finalUrl
}

export const getImageUrl = (image: string | null | undefined, placeholder?: string): string => {
  return buildImageUrl(image, { placeholder }) as string
}

export const getLegacyApiImageUrl = (image: string | null | undefined): string | null => {
  return buildImageUrl(image, { keepApiSegment: true, allowNull: true })
}

/**
 * Utility function khusus untuk gambar user (bisa return null)
 */
export const getUserImageUrl = (
  image: string | null | undefined,
  placeholder?: string,
): string | null => {
  if (!image && placeholder) {
    return placeholder
  }
  return buildImageUrl(image, { allowNull: true })
}

export const getLegacyUserImageUrl = (image: string | null | undefined): string | null => {
  return buildImageUrl(image, { keepApiSegment: true, allowNull: true })
}

