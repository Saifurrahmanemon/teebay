import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { ProtectedRoute } from './components/auth/protected-routes';
import { ProductList } from './components/my-products/product-list';
import MyProducts from './pages/my-products';
import MyProductUpdate from './pages/my-product-update';
import CreateProduct from './pages/create-product';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MyProducts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <MyProductUpdate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-product"
        element={
          <ProtectedRoute>
            <CreateProduct />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
