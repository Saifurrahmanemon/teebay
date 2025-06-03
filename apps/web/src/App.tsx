import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { ProtectedRoute } from './components/auth/protected-routes';
import { ProductList } from './components/my-products/product-list';
import MyProducts from './pages/my-products';
import MyProductUpdate from './pages/my-product-update';
import CreateProduct from './pages/create-product';
import { DashboardLayout } from './layout/dashboard';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MyProducts />
            </DashboardLayout>
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

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
