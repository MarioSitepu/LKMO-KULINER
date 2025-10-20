// src/components/Layout.tsx

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
  SearchIcon,
  ChevronDownIcon,
} from 'lucide-react'
import Footer from './footer'

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isKategoriOpen, setIsKategoriOpen] = useState(false)
  const [isHargaOpen, setIsHargaOpen] = useState(false)
  const [isPeralatanOpen, setIsPeralatanOpen] = useState(false)
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
      {/* ... (Tombol Mobile Menu tetap sama) ... */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 md:hidden bg-orange-500 text-white p-2 rounded-md"
      >
        {isMobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static z-40 w-64 h-full transition-transform duration-300 ease-in-out bg-white shadow-lg`}
      >
        <div className="flex flex-col h-full">
          {/* ... (Logo tetap sama) ... */}
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
                  className={`flex items-center px-4 py-3 rounded-md ${isActive(
                    '/',
                  )}`}
                >
                  <HomeIcon size={20} className="mr-3" />
                  <span>Beranda</span>
                </Link>
              </li>

              {/* === PERUBAHAN DI SINI === */}
              {/* UBAH BUTTON MENJADI LINK */}
              <li>
                <Link
                  to="/search" // 1. Arahkan ke /search
                  className={`flex items-center w-full px-4 py-3 rounded-md ${isActive(
                    '/search', // 2. Gunakan isActive untuk /search
                  )}`}
                >
                  <SearchIcon size={20} className="mr-3" />
                  <span>Cari resep...</span>
                </Link>
              </li>
              {/* === AKHIR PERUBAHAN === */}


              {/* DROPDOWN KATEGORI */}
              <li className="pt-2">
                <button
                  onClick={() => setIsKategoriOpen(!isKategoriOpen)}
                  className="flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-orange-50"
                >
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Kategori
                  </p>
                  <ChevronDownIcon
                    size={16}
                    className={`text-gray-500 transition-transform duration-300 ${
                      isKategoriOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
                <ul
                  className={`mt-2 space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${
                    isKategoriOpen ? 'max-h-[500px]' : 'max-h-0'
                  }`}
                >
                  <li>
                    <Link
                      to="/category/breakfast"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/category/breakfast',
                      )}`}
                    >
                      <span className="ml-6">Sarapan</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/lunch"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/category/lunch',
                      )}`}
                    >
                      <span className="ml-6">Makan Siang</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/dinner"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/category/dinner',
                      )}`}
                    >
                      <span className="ml-6">Makan Malam</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/snack"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/category/snack',
                      )}`}
                    >
                      <span className="ml-6">Camilan</span>
                    </Link>
                  </li>
                </ul>
              </li>

              {/* DROPDOWN HARGA */}
              <li className="pt-2">
                <button
                  onClick={() => setIsHargaOpen(!isHargaOpen)}
                  className="flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-orange-50"
                >
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Harga
                  </p>
                  <ChevronDownIcon
                    size={16}
                    className={`text-gray-500 transition-transform duration-300 ${
                      isHargaOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
                <ul
                  className={`mt-2 space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${
                    isHargaOpen ? 'max-h-[500px]' : 'max-h-0'
                  }`}
                >
                  <li>
                    <Link
                      to="/category/10.000"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/category/10.000',
                      )}`}
                    >
                      <span className="ml-6">Dibawah Rp10.000</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/10.000-25.000"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/10.000-25.000',
                      )}`}
                    >
                      <span className="ml-6"> Rp 10.000 - Rp 25.000</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/25.000"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/25.000',
                      )}`}
                    >
                      <span className="ml-6">Diatas Rp 25.000</span>
                    </Link>
                  </li>
                </ul>
              </li>

              {/* DROPDOWN PERALATAN */}
              <li className="pt-2">
                <button
                  onClick={() => setIsPeralatanOpen(!isPeralatanOpen)}
                  className="flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-orange-50"
                >
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Peralatan
                  </p>
                  <ChevronDownIcon
                    size={16}
                    className={`text-gray-500 transition-transform duration-300 ${
                      isPeralatanOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
                <ul
                  className={`mt-2 space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${
                    isPeralatanOpen ? 'max-h-[500px]' : 'max-h-0'
                  }`}
                >
                  <li>
                    <Link
                      to="/equipment/rice-cooker"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/equipment/rice-cooker',
                      )}`}
                    >
                      <span className="ml-6">Rice Cooker</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/equipment/microwave"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/equipment/microwave',
                      )}`}
                    >
                      <span className="ml-6">Microwave</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/equipment/portable-stove"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/equipment/portable-stove',
                      )}`}
                    >
                      <span className="ml-6">Kompor</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/equipment/panci-rebus"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/panci-rebus',
                      )}`}
                    >
                      <span className="ml-6">Panci Rebus</span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="pt-4">
                <Link
                  to="/upload"
                  className={`flex items-center px-4 py-3 rounded-md ${isActive(
                    '/upload',
                  )}`}
                >
                  <PlusIcon size={20} className="mr-3" />
                  <span>Upload Resep</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className={`flex items-center px-4 py-3 rounded-md ${isActive(
                    '/profile',
                  )}`}
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
      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          <div className="container mx-auto p-4 md:p-6">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}