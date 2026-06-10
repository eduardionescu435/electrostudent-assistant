import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { LoginPage } from "@/features/auth/pages/login-page";
import { RegisterPage } from "@/features/auth/pages/register-page";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page";
import { ComponentListPage } from "@/features/components/pages/component-list-page";
import { ComponentDetailPage } from "@/features/components/pages/component-detail-page";
import { CalculatorsPage } from "@/features/calculators/pages/calculators-page";
import { OhmsLawPage } from "@/features/calculators/pages/ohms-law-page";
import { PowerPage } from "@/features/calculators/pages/power-page";
import { ResistorColorCodePage } from "@/features/calculators/pages/resistor-color-code-page";
import { RCLowPassPage } from "@/features/calculators/pages/rc-lowpass-page";
import { RCHighPassPage } from "@/features/calculators/pages/rc-highpass-page";
import { ProtectedRoute } from "@/routes/protected-route";
import { useAuthStore } from "@/store/auth-store";

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (response.status === 401) {
    useAuthStore.getState().logout();
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
  return response;
};

export function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="inventory" element={<ComponentListPage />} />
            <Route path="inventory/:id" element={<ComponentDetailPage />} />
            <Route path="calculators">
              <Route index element={<CalculatorsPage />} />
              <Route path="ohms-law" element={<OhmsLawPage />} />
              <Route path="power" element={<PowerPage />} />
              <Route path="resistor-color-code" element={<ResistorColorCodePage />} />
              <Route path="rc-lowpass" element={<RCLowPassPage />} />
              <Route path="rc-highpass" element={<RCHighPassPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors closeButton position="top-right" />
    </>
  );
}

export default App;

