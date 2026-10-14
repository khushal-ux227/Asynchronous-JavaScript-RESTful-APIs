import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Product,
  ProductVariant,
  CartItem,
  Order,
  CurrencyCode,
  CurrencyConfig,
  ToastMessage,
  ShippingAddress,
  PaymentMethodType,
} from '../types/ecommerce';
import { PRODUCTS } from '../data/products';

const STORAGE_KEY_CART = 'aura_cart_v1';
const STORAGE_KEY_WISHLIST = 'aura_wishlist_v1';
const STORAGE_KEY_ORDERS = 'aura_orders_v1';
const STORAGE_KEY_CURRENCY = 'aura_currency_v1';

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
  JPY: { code: 'JPY', symbol: '¥', rate: 152.0 },
};

interface ShopContextValue {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amountInUsd: number) => string;

  orders: Order[];
  placeOrder: (
    address: ShippingAddress,
    paymentMethod: PaymentMethodType,
    shippingFee?: number
  ) => Order;
  getOrderById: (orderId: string) => Order | undefined;

  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Currency
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENCY) as CurrencyCode;
      return saved && CURRENCY_CONFIGS[saved] ? saved : 'USD';
    } catch {
      return 'USD';
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) return JSON.parse(saved);
      // Seed with 1 realistic initial order for demo tracking
      const sampleItem = PRODUCTS[1]; // Travertine lamp
      return [
        {
          orderId: 'AURA-89214',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          items: [
            {
              id: 'seed-01',
              product: sampleItem,
              variant: sampleItem.variants[0],
              quantity: 1,
              unitPrice: sampleItem.price,
              addedAt: Date.now() - 86400000 * 2,
            },
          ],
          subtotal: 380,
          shippingFee: 0,
          tax: 30.4,
          total: 410.4,
          currency: 'USD',
          shippingAddress: {
            fullName: 'Alexander Wright',
            email: 'a.wright@architects-studio.com',
            phone: '+1 (555) 234-8901',
            addressLine1: '450 Mission Street, Suite 1200',
            city: 'San Francisco',
            stateProvince: 'CA',
            postalCode: '94105',
            country: 'United States',
          },
          paymentMethod: 'credit_card',
          status: 'shipped',
          trackingNumber: 'FX-99201481US',
          carrier: 'FedEx Freight Ground',
          estimatedDelivery: 'Tomorrow by 4:30 PM',
        },
      ];
    } catch {
      return [];
    }
  });

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENCY, currency);
    } catch {}
  }, [currency]);

  // Cart operations
  const addToCart = useCallback(
    (product: Product, variant: ProductVariant, quantity = 1) => {
      const unitPrice = product.price + variant.priceDelta;
      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product.id === product.id && item.variant.id === variant.id
        );

        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }

        const newItem: CartItem = {
          id: `${product.id}-${variant.id}-${Date.now()}`,
          product,
          variant,
          quantity,
          unitPrice,
          addedAt: Date.now(),
        };
        return [...prev, newItem];
      });

      addToast(
        'Added to Shopping Bag',
        `${quantity}× ${product.name} (${variant.name})`,
        'success'
      );
      setIsCartOpen(true);
    },
    [addToast]
  );

  const updateQuantity = useCallback((cartItemId: string, newQuantity: number) => {
    setCart((prev) => {
      if (newQuantity <= 0) {
        return prev.filter((item) => item.id !== cartItemId);
      }
      return prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      );
    });
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Wishlist
  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const isPresent = prev.includes(productId);
        if (isPresent) {
          addToast('Saved items updated', 'Removed from your private collection', 'info');
          return prev.filter((id) => id !== productId);
        } else {
          addToast('Saved to Collection', 'Object bookmarked for your next interior review', 'success');
          return [...prev, productId];
        }
      });
    },
    [addToast]
  );

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  // Price formatting
  const formatPrice = useCallback(
    (amountInUsd: number) => {
      const cfg = CURRENCY_CONFIGS[currency];
      const converted = amountInUsd * cfg.rate;
      if (currency === 'JPY') {
        return `${cfg.symbol}${Math.round(converted).toLocaleString()}`;
      }
      return `${cfg.symbol}${converted.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    },
    [currency]
  );

  // Derived calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  // Place order
  const placeOrder = useCallback(
    (address: ShippingAddress, paymentMethod: PaymentMethodType, shippingFee = 0) => {
      const subtotal = cartSubtotal;
      const tax = Math.round(subtotal * 0.08 * 100) / 100;
      const total = subtotal + shippingFee + tax;
      const randomId = `AURA-${Math.floor(10000 + Math.random() * 90000)}`;

      const newOrder: Order = {
        orderId: randomId,
        createdAt: new Date().toISOString(),
        items: [...cart],
        subtotal,
        shippingFee,
        tax,
        total,
        currency,
        shippingAddress: address,
        paymentMethod,
        status: 'confirmed',
        trackingNumber: `AURA-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
        carrier: 'Complimentary White-Glove Freight',
        estimatedDelivery: 'Dispatches within 48 hours',
      };

      setOrders((prev) => [newOrder, ...prev]);
      setCart([]);
      setIsCartOpen(false);
      addToast('Order Placed Successfully', `Order #${randomId} is confirmed for dispatch.`, 'success');

      return newOrder;
    },
    [cart, cartSubtotal, currency, addToast]
  );

  const getOrderById = useCallback(
    (orderId: string) => {
      return orders.find((o) => o.orderId === orderId);
    },
    [orders]
  );

  return (
    <ShopContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        isWishlisted,
        currency,
        setCurrency,
        formatPrice,
        orders,
        placeOrder,
        getOrderById,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return ctx;
}
