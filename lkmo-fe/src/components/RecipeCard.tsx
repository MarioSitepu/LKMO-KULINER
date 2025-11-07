import { Link } from 'react-router-dom'
import { StarIcon, ClockIcon, TagIcon } from 'lucide-react'
import { getImageUrl, getLegacyApiImageUrl } from '../utils/imageUtils'
import defaultRecipeImage from '../assets/default-recipe.svg'

interface RecipeCardProps {
  id: string
  title: string
  image?: string | null
  rating: number
  prepTime: string
  equipment: string[]
  author: string
  price: string
}

const RecipeCard = ({
  id,
  title,
  image,
  rating,
  prepTime,
  equipment,
  author,
  price,
}: RecipeCardProps) => {
  return (
    <Link to={`/recipe/${id}`} className="block h-full">
      <div className="h-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={getImageUrl(image, defaultRecipeImage)}
            data-legacy-src={getLegacyApiImageUrl(image) || undefined}
            alt={title}
            className="w-full h-full object-cover"
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
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="flex items-center">
              <StarIcon size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-white text-sm">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{title}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <ClockIcon size={14} className="mr-1" />
            <span>{prepTime}</span>
          </div>
          <div className="flex items-center text-sm font-semibold text-green-600 mb-2">
            <TagIcon size={14} className="mr-1" />
            <span>{price}</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {equipment.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-500">Oleh: {author}</div>
        </div>
      </div>
    </Link>
  )
}

export default RecipeCard