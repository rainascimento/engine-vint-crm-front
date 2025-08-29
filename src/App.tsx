import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordCode from "./pages/ResetPasswordCode";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Opportunities from "./pages/Opportunities";
import NewOpportunity from "./pages/NewOpportunity";
import OpportunityDetail from "./pages/OpportunityDetail";
import Profile from "./pages/Profile";
import Permissions from "./pages/Permissions";
import Parameters from "./pages/Parameters";
import Clients from "./pages/Clients";
import ClientRegistration from "./pages/ClientRegistration";
import NotFound from "./pages/NotFound";
import CadastroOportunidade from "./pages/CadastroOportunidade";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password-code" element={<ResetPasswordCode />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/opportunities" 
              element={
                <ProtectedRoute>
                  <Opportunities />
                </ProtectedRoute>
              } 
            />
       
             <Route 
              path="/opportunities/new" 
              element={
                <ProtectedRoute>
                  <CadastroOportunidade />
                </ProtectedRoute>
              } 
            />


            <Route 
              path="/opportunities/:id" 
              element={
                <ProtectedRoute>
                  <OpportunityDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/clients" 
              element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/permissions" 
              element={
                <ProtectedRoute>
                  <Permissions />
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/parameters" 
              element={
                <ProtectedRoute>
                  <Parameters />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clients/register" 
              element={
                <ProtectedRoute>
                  <ClientRegistration />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
