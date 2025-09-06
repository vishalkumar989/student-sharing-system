import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Component Imports
import ProtectedRoute from './components/ProtectedRoute'; // <-- Naya Import

// Page Imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddItemPage from './pages/AddItemPage';
import ItemDetailPage from './pages/ItemDetailPage';
import MyItemsPage from './pages/MyItemsPage';
import EditItemPage from './pages/EditItemPage';

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />

        {/* Private Routes (Gatekeeper ke andar) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/my-items" element={<MyItemsPage />} />
          <Route path="/add-item" element={<AddItemPage />} />
          <Route path="/edit-item/:id" element={<EditItemPage />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App;