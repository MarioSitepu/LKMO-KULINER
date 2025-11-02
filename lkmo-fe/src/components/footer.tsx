import { Link } from 'react-router-dom'
import { CookingPotIcon } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full border-t border-orange-100 mt-12 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <CookingPotIcon size={20} className="text-orange-500" />
              <h1 className="text-lg font-bold text-orange-500">
                YangPentingMakan
              </h1>
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500">
              © 2025 YangPentingMakan. LKMO Kel 7 RAWr.
            </p>
          </div>

        </div>
      </div>
    </footer>
  )
}