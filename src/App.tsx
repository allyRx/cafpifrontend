
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./components/Layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Folders } from "./pages/Folders";
import { Upload } from "./pages/Upload";
import { Results } from "./pages/Results";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { RegisterPage } from "./pages/Register"; // Import RegisterPage

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/register" element={<RegisterPage />} />

            {/*
              The current setup redirects "/" to "/dashboard".
              If "/" is meant to be the login page for unauthenticated users,
              the ProtectedRoute or a new IndexPage route needs to handle that.
              For now, adding /register as a distinct public route.
              If there was an explicit login route like /login, it would go here too.
            */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected Application Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
            </Route>
            <Route path="/folders" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Folders />} />
            </Route>
            <Route path="/upload" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Upload />} />
            </Route>
            <Route path="/results" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Results />} />
            </Route>
            <Route path="/settings" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
