// src/components/Layout.tsx

import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  UserIcon,
  PlusIcon,
  LogInIcon,
  MenuIcon,
  XIcon,
  SearchIcon,
  ChevronDownIcon,
  TrophyIcon,
  ShieldIcon,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Footer from './footer'

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isKategoriOpen, setIsKategoriOpen] = useState(false)
  const [isHargaOpen, setIsHargaOpen] = useState(false)
  const [isPeralatanOpen, setIsPeralatanOpen] = useState(false)
  const location = useLocation()
  const { isAdmin, isAuthenticated } = useAuth()

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'bg-green-100 text-green-600'
      : 'text-gray-600 hover:bg-green-50'
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="flex min-h-screen bg-green-50/30">
      {/* ... (Tombol Mobile Menu tetap sama) ... */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 md:hidden bg-green-500 text-white p-2 rounded-md"
      >
        {isMobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:sticky md:top-0 md:self-start z-40 w-64 h-full md:h-screen transition-transform duration-300 ease-in-out bg-white shadow-lg`}
      >
        <div className="flex flex-col h-full">
          {/* ... (Logo tetap sama) ... */}
          <div className="flex items-center justify-center py-6 border-b border-green-100">
            <Link to="/" className="flex items-center gap-2">
              <img src="/buku.svg" alt="Logo" className="h-6 w-6 object-contain" />
              <h1 className="text-xl font-bold text-green-500">
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

              <li>
                <Link
                  to="/leaderboard"
                  className={`flex items-center px-4 py-3 rounded-md ${isActive(
                    '/leaderboard',
                  )}`}
                >
                  <TrophyIcon size={20} className="mr-3" />
                  <span>Leaderboard</span>
                </Link>
              </li>

              {/* DROPDOWN WAKTU MAKAN */}
              <li className="pt-2">
                <button
                  onClick={() => setIsKategoriOpen(!isKategoriOpen)}
                  className="flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-green-50"
                >
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Waktu Makan
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
                  className="flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-green-50"
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
                      to="/price/under-10000"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/price/under-10000',
                      )}`}
                    >
                      <span className="ml-6">Dibawah Rp 10.000</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/price/10000-25000"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/price/10000-25000',
                      )}`}
                    >
                      <span className="ml-6">Rp 10.000 - Rp 25.000</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/price/over-25000"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/price/over-25000',
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
                  className="flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-green-50"
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
                      to="/equipment/kompor"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/equipment/kompor',
                      )}`}
                    >
                      <span className="ml-6">Kompor</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/equipment/wajan"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/equipment/wajan',
                      )}`}
                    >
                      <span className="ml-6">Wajan</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/equipment/panci-rebus"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/equipment/panci-rebus',
                      )}`}
                    >
                      <span className="ml-6">Panci rebus</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/equipment/lainnya"
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(
                        '/equipment/lainnya',
                      )}`}
                    >
                      <span className="ml-6">Lainnya</span>
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
              {isAuthenticated && isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className={`flex items-center px-4 py-3 rounded-md ${isActive(
                      '/admin',
                    )}`}
                  >
                    <ShieldIcon size={20} className="mr-3" />
                    <span>Admin</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          {/* Login button */}
          {!isAuthenticated && (
            <div className="p-4 border-t border-green-100">
              <Link
                to="/login"
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
              >
                <LogInIcon size={18} className="mr-2" />
                <span>Masuk</span>
              </Link>
            </div>
          )}
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