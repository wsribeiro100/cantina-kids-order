
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { UserProvider } from "./contexts/UserContext";
import { motion, AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminDashboard from "./pages/AdminDashboard";
import CatalogoFunc from "./pages/CatalogoFunc";
import NotFound from "./pages/NotFound";

// New Pages
import UserDashboard from "./pages/UserDashboard";
import UserProfilePage from "./pages/UserProfile";
import UserRegistrationPage from "./pages/UserRegistration";
import WalletPage from "./pages/Wallet";
import OrderHistoryPage from "./pages/OrderHistory";
import Checkout from "./pages/Checkout";

// Admin pages
import ProductManagementPage from "./pages/ProductManagement";
import NotificationsPage from "./pages/Notifications";
import AuditLogsPage from "./pages/AuditLogs";
import OrderTrackingPage from "./pages/OrderTracking";

// Novos imports para as novas rotas
import ReportsPage from "./pages/Reports";
import UsersManagementPage from "./pages/UsersManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/confirmation" element={<OrderConfirmation />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/catalogo" element={<CatalogoFunc />} />
                
                {/* User Routes */}
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/registration" element={<UserRegistrationPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/order-history" element={<OrderHistoryPage />} />
                <Route path="/checkout" element={<Checkout />} />
                
                {/* Admin Routes */}
                <Route path="/admin/products" element={<ProductManagementPage />} />
                <Route path="/admin/notifications" element={<NotificationsPage />} />
                <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
                <Route path="/admin/order-tracking" element={<OrderTrackingPage />} />

                {/* Novas rotas */}
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/users" element={<UsersManagementPage />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </CartProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
