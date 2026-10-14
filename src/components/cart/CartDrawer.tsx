import React from 'react';
import { useShop } from '../../context/ShopContext';
import { useRouter } from '../../context/RouterContext';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { OptimizedImage } from '../common/OptimizedImage';

const FREE_SHIPPING_THRESHOLD_USD = 300;

export function CartDrawer() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    formatPrice,
  } = useShop();
  const { navigate } = useRouter();

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD_USD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - cartSubtotal);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-50 border-l border-stone-200 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-display text-stone-900">
                Shopping Bag
              </h2>
              <p className="text-xs text-stone-500 mt-0.5 font-mono">
                {cartCount} {cartCount === 1 ? 'object' : 'objects'} selected
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Close bag drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Freight Progress */}
          <div className="px-6 py-3 bg-stone-100/70 border-b border-stone-200 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-stone-600 mb-1.5 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>
                  Add <span className="font-semibold text-stone-900">{formatPrice(remainingForFreeShipping)}</span> more for complimentary freight delivery.
                </span>
              </p>
            ) : (
              <p className="text-stone-800 font-medium mb-1.5 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-stone-900 shrink-0" />
                <span>Your order qualifies for complimentary freight delivery.</span>
              </p>
            )}
            <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-stone-900 h-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-200">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3 border border-stone-200">
                  <X className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-semibold text-stone-800">
                  Your shopping bag is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mt-1 leading-relaxed">
                  Explore our curated architectural furniture, travertine lighting, and precision tableware.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/catalog');
                  }}
                  className="mt-5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg text-xs font-medium transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-stone-200 bg-stone-100">
                    <OptimizedImage
                      src={item.product.images.hero}
                      alt={item.product.name}
                      aspectRatio="1/1"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            setIsCartOpen(false);
                            navigate(`/product/${item.product.slug}`);
                          }}
                          className="text-xs font-semibold text-stone-900 hover:underline cursor-pointer line-clamp-1"
                        >
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-stone-700 p-0.5 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                        {item.variant.name}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-300 rounded bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium text-stone-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="text-xs font-mono tabular-nums font-semibold text-stone-900">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-100/60 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-medium text-stone-900">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Estimated Freight</span>
                  <span className="font-mono tabular-nums text-stone-900">
                    {cartSubtotal >= FREE_SHIPPING_THRESHOLD_USD ? 'Free' : formatPrice(25)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="font-mono tabular-nums text-sm">
                    {formatPrice(
                      cartSubtotal + (cartSubtotal >= FREE_SHIPPING_THRESHOLD_USD ? 0 : 25)
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                  White-glove guarantee
                </span>
                <span aria-hidden="true">·</span>
                <span>30-day returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
