import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="w-full border-t border-green-100 mt-12 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="h-5 w-5 object-contain" />
              <h1 className="text-lg font-bold text-green-500">
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