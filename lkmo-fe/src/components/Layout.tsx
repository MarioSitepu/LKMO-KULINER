import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  UserIcon,
  PlusIcon,
  LogInIcon,
  CookingPotIcon,
  MenuIcon,
  XIcon,
} from 'lucide-react'

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  
  const isActive = (path: string) => {
    return location.pathname === path
      ? 'bg-orange-100 text-orange-600'
      : 'text-gray-600 hover:bg-orange-50'
  }
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  
  return (
    <div className="flex min-h-screen bg-orange-50/30">
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 md:hidden bg-orange-500 text-white p-2 rounded-md"
      >
        {isMobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
      </button>
      {/* Sidebar */}
      <div
        className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static z-40 w-64 h-full transition-transform duration-300 ease-in-out bg-white shadow-lg`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center py-6 border-b border-orange-100">
            <Link to="/" className="flex items-center gap-2">
              <CookingPotIcon size={24} className="text-orange-500" />
              <h1 className="text-xl font-bold text-orange-500">
                YangPentingMakan
              </h1>
            </Link>
          </div>
          {/* Navigation links */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-3">
              <li>
                <Link
                  to="/"
                  className={`flex items-center px-4 py-3 rounded-md ${isActive('/')}`}
                >
                  <HomeIcon size={20} className="mr-3" />
                  <span>Beranda</span>
                </Link>
              </li>
              <li className="pt-4">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase">
                  Kategori
                </p>
                <ul className="mt-2 space-y-1">
                  <li>
                    <Link
                      to="/category/breakfast"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive('/category/breakfast')}`}
                    >
                      <span className="ml-6">Sarapan</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/lunch"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive('/category/lunch')}`}
                    >
                      <span className="ml-6">Makan Siang</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/dinner"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive('/category/dinner')}`}
                    >
                      <span className="ml-6">Makan Malam</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/snack"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive('/category/snack')}`}
                    >
                      <span className="ml-6">Camilan</span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="pt-4">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase">
                  Peralatan
                </p>
                <ul className="mt-2 space-y-1">
                  <li>
                    <Link
                      to="/equipment/rice-cooker"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive('/equipment/rice-cooker')}`}
                    >
                      <span className="ml-6">Rice Cooker</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/equipment/microwave"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive('/equipment/microwave')}`}
                    >
                      <span className="ml-6">Microwave</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/equipment/portable-stove"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive('/equipment/portable-stove')}`}
                    >
                      <span className="ml-6">Kompor Portable</span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="pt-4">
                <Link
                  to="/upload"
                  className={`flex items-center px-4 py-3 rounded-md ${isActive('/upload')}`}
                >
                  <PlusIcon size={20} className="mr-3" />
                  <span>Upload Resep</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className={`flex items-center px-4 py-3 rounded-md ${isActive('/profile')}`}
                >
                  <UserIcon size={20} className="mr-3" />
                  <span>Profil</span>
                </Link>
              </li>
            </ul>
          </nav>
          {/* Login button */}
          <div className="p-4 border-t border-orange-100">
            <Link
              to="/login"
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
            >
              <LogInIcon size={18} className="mr-2" />
              <span>Masuk</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1">
        <div className="container mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}