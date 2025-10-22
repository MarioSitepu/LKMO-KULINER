import { Route, Routes } from "react-router-dom"
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import RecipePage from './pages/RecipePage'
import UploadRecipePage from './pages/UploadRecipePage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import EquipmentPage from './pages/EquipmentPage'
import CategoryPage from './pages/CategoryPage'
import SearchPage from './pages/SearchPage' // <-- 1. IMPORT HALAMAN BARU
import EditProfilePage from './pages/EditProfilePage'

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="recipe/:id" element={<RecipePage />} />
        <Route path="upload" element={<UploadRecipePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="edit-profile" element={<EditProfilePage />} />
        <Route path="equipment/:type" element={<EquipmentPage />} />
        <Route path="category/:type" element={<CategoryPage />} />
        <Route path="search" element={<SearchPage />} /> {/* <-- 2. TAMBAHKAN RUTE BARU */}
        </Route>
      </Routes>
    </>
  )
}

export default App