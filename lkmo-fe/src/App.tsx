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
        <Route path="equipment/:type" element={<EquipmentPage />} />
        <Route path="category/:type" element={<CategoryPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

