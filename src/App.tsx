
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
import { Subscription } from "./pages/Subscription";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
            <Route path="/reports" element={
              <ProtectedRoute requiresPremium>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<div className="p-6"><h1 className="text-2xl font-bold">Rapports Premium</h1><p>Fonctionnalité premium en développement...</p></div>} />
            </Route>
            <Route path="/subscription" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Subscription />} />
            </Route>
            <Route path="/settings" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<div className="p-6"><h1 className="text-2xl font-bold">Paramètres</h1><p>Page de paramètres en développement...</p></div>} />
            </Route>
            <Route path="/help" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<div className="p-6"><h1 className="text-2xl font-bold">Aide & Support</h1><p>Documentation et support en développement...</p></div>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
