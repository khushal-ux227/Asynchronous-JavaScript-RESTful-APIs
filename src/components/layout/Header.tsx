import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useShop, CURRENCY_CONFIGS } from '../../context/ShopContext';
import { ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';
import { CurrencyCode } from '../../types/ecommerce';

export function Header() {
  const { navigate, route } = useRouter();
  const { cartCount, setIsCartOpen, currency, setCurrency } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => handleNav('/')}
          className="text-lg font-bold tracking-tight text-stone-950 font-display whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity"
        >
          AURA OBJECTS
        </button>

        {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => handleNav('/catalog')}
            className={`whitespace-nowrap shrink-0 hover:text-stone-950 transition-colors ${
              route === 'catalog' ? 'text-stone-950 font-semibold' : ''
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => handleNav('/catalog?category=furniture')}
            className="whitespace-nowrap shrink-0 hover:text-stone-950 transition-colors"
          >
            Furniture
          </button>
          <button
            onClick={() => handleNav('/catalog?category=lighting')}
            className="whitespace-nowrap shrink-0 hover:text-stone-950 transition-colors"
          >
            Lighting
          </button>
          <button
            onClick={() => handleNav('/orders')}
            className={`whitespace-nowrap shrink-0 hover:text-stone-950 transition-colors ${
              route === 'orders' || route === 'order-confirmation'
                ? 'text-stone-950 font-semibold'
                : ''
            }`}
          >
            Orders & Tracking
          </button>
          <button
            onClick={() => handleNav('/deployment')}
            className={`whitespace-nowrap shrink-0 hover:text-stone-950 transition-colors flex items-center gap-1 ${
              route === 'deployment' ? 'text-stone-950 font-semibold' : 'text-stone-500'
            }`}
          >
            <span>Architecture & Deploy</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </nav>

        {/* Zone 3: Primary Action & Shopping Bag */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Currency Switcher */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="bg-transparent text-xs font-mono font-medium text-stone-600 hover:text-stone-950 border border-stone-300 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer"
            aria-label="Select currency"
          >
            {Object.keys(CURRENCY_CONFIGS).map((code) => (
              <option key={code} value={code} className="bg-stone-50 text-stone-900">
                {code} ({CURRENCY_CONFIGS[code as CurrencyCode].symbol})
              </option>
            ))}
          </select>

          {/* Bag button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-stone-800 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5"
            aria-label={`Shopping Bag, ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
            <span className="text-xs font-mono tabular-nums font-semibold">
              {cartCount}
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-950 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-stone-50 px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <button
            onClick={() => handleNav('/catalog')}
            className="block w-full text-left py-1.5 text-sm font-medium text-stone-800 hover:text-stone-950"
          >
            Complete Catalog
          </button>
          <button
            onClick={() => handleNav('/catalog?category=furniture')}
            className="block w-full text-left py-1.5 text-sm font-medium text-stone-700 hover:text-stone-950"
          >
            Seating & Furniture
          </button>
          <button
            onClick={() => handleNav('/catalog?category=lighting')}
            className="block w-full text-left py-1.5 text-sm font-medium text-stone-700 hover:text-stone-950"
          >
            Architectural Lighting
          </button>
          <button
            onClick={() => handleNav('/catalog?category=tableware')}
            className="block w-full text-left py-1.5 text-sm font-medium text-stone-700 hover:text-stone-950"
          >
            Tableware & Vessels
          </button>
          <button
            onClick={() => handleNav('/orders')}
            className="block w-full text-left py-1.5 text-sm font-medium text-stone-700 hover:text-stone-950"
          >
            Orders & Live Tracking
          </button>
          <button
            onClick={() => handleNav('/deployment')}
            className="block w-full text-left py-1.5 text-sm font-semibold text-stone-950 flex items-center justify-between pt-2 border-t border-stone-200"
          >
            <span>Architecture & DevOps Deployment</span>
            <ArrowUpRight className="w-4 h-4 text-stone-500" />
          </button>
        </div>
      )}
    </header>
  );
}
