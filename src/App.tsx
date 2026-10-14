/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ToastNotifications } from './components/common/ToastNotifications';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrdersPage } from './pages/OrdersPage';
import { DeploymentArchitecturePage } from './pages/DeploymentArchitecturePage';
import { X, Sparkles, ArrowRight } from 'lucide-react';

function AppContent() {
  const { route, navigate } = useRouter();
  const [showTopBanner, setShowTopBanner] = useState(true);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-stone-900 selection:text-white">
      {/* Slim Promotional Announcement Bar (Max 40px, dismissible) */}
      {showTopBanner && (
        <div className="bg-stone-900 text-stone-200 px-4 py-2 text-xs flex items-center justify-between z-40 border-b border-stone-800">
          <div className="flex-1 text-center font-mono text-[11px] flex items-center justify-center gap-2">
            <span>Complimentary white-glove freight on orders over $300</span>
            <span aria-hidden="true" className="text-stone-600 hidden sm:inline">·</span>
            <button
              onClick={() => navigate('/deployment')}
              className="text-stone-300 hover:text-white underline underline-offset-2 hidden sm:inline"
            >
              Inspect Capstone DevOps Blueprint
            </button>
          </div>
          <button
            onClick={() => setShowTopBanner(false)}
            className="text-stone-400 hover:text-stone-200 p-0.5 rounded transition-colors ml-2"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header />

      {/* Dynamic Route Content */}
      <main className="flex-1">
        {route === 'home' && <HomePage />}
        {route === 'catalog' && <CatalogPage />}
        {route === 'product-detail' && <ProductDetailPage />}
        {route === 'checkout' && <CheckoutPage />}
        {route === 'order-confirmation' && <OrderConfirmationPage />}
        {route === 'orders' && <OrdersPage />}
        {route === 'deployment' && <DeploymentArchitecturePage />}
      </main>

      {/* Global Shopping Drawer */}
      <CartDrawer />

      {/* Global Toast Stack */}
      <ToastNotifications />

      {/* Architectural Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <ShopProvider>
        <AppContent />
      </ShopProvider>
    </RouterProvider>
  );
}
