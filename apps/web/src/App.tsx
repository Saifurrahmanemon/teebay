import { Routes, Route, Navigate } from 'react-router-dom';

import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { ProtectedRoute } from './components/auth/protected-routes';
import MyProducts from './pages/my-products';
import MyProductUpdate from './pages/my-product-update';
import CreateProduct from './pages/create-product';
import { DashboardLayout } from './layout/dashboard';
import AllProduct from './pages/all-products';
import ProductDetails from './pages/product-details';
import MyTransactions from './pages/my-transactions';

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
        path="/create-product"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CreateProduct />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MyProductUpdate />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-product"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CreateProduct />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AllProduct />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProductDetails />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MyTransactions />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
