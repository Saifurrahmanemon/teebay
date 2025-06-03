import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { ProtectedRoute } from './components/auth/protected-routes';
import { ProductList } from './components/my-products/product-list';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
