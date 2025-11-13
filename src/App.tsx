import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ClientDashboard from "./pages/ClientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBriefManagement from "./pages/AdminBriefManagement";
import NotificationsPage from "./pages/NotificationsPage";
import CreateBrief from "./pages/CreateBrief";
import BriefDetails from "./pages/BriefDetails";
import NotFound from "./pages/NotFound";

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: 'ADMIN' | 'CLIENT' }> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isLoading } = useAuth();
  
  // Show nothing while loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user.role === 'ADMIN' ? '/admin' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={
        isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : user ? (
          <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />
        ) : (
          <LoginPage />
        )
      } />
      
      {/* Client routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="CLIENT">
          <ClientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/create-brief" element={
        <ProtectedRoute requiredRole="CLIENT">
          <CreateBrief />
        </ProtectedRoute>
      } />
      <Route path="/brief/:id" element={
        <ProtectedRoute requiredRole="CLIENT">
          <BriefDetails />
        </ProtectedRoute>
      } />
      
      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/brief/:id" element={
        <ProtectedRoute requiredRole="ADMIN">
          <BriefDetails />
        </ProtectedRoute>
      } />
      <Route path="/admin/brief/:id/manage" element={
        <ProtectedRoute requiredRole="ADMIN">
          <AdminBriefManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/notifications" element={
        <ProtectedRoute requiredRole="ADMIN">
          <NotificationsPage />
        </ProtectedRoute>
      } />
      
      {/* Notifications routes */}
      <Route path="/notifications" element={
        <ProtectedRoute requiredRole="CLIENT">
          <NotificationsPage />
        </ProtectedRoute>
      } />
      
      {/* Catch-all routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
