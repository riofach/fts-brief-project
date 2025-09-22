import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ClientDashboard from "./pages/ClientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateBrief from "./pages/CreateBrief";
import BriefDetails from "./pages/BriefDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: 'client' | 'admin' }> = ({ 
  children, 
  requiredRole 
}) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <LoginPage />} />
      
      {/* Client routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="client">
          <ClientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/create-brief" element={
        <ProtectedRoute requiredRole="client">
          <CreateBrief />
        </ProtectedRoute>
      } />
      <Route path="/brief/:id" element={
        <ProtectedRoute requiredRole="client">
          <BriefDetails />
        </ProtectedRoute>
      } />
      
      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/brief/:id" element={
        <ProtectedRoute requiredRole="admin">
          <BriefDetails />
        </ProtectedRoute>
      } />
      
      {/* Catch-all routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <AppRoutes />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
