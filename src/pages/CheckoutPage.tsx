import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useShop } from '../context/ShopContext';
import { ShippingAddress, PaymentMethodType } from '../types/ecommerce';
import { OptimizedImage } from '../components/common/OptimizedImage';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  ArrowLeft,
  Lock,
  CheckCircle2,
} from 'lucide-react';

export function CheckoutPage() {
  const { cart, cartSubtotal, formatPrice, placeOrder } = useShop();
  const { navigate } = useRouter();

  // Form state
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'David K. Miller',
    email: 'd.miller@architecture-studio.com',
    phone: '+1 (555) 749-3820',
    addressLine1: '742 Evergreen Terrace',
    addressLine2: 'Studio Suite 4B',
    city: 'Seattle',
    stateProvince: 'WA',
    postalCode: '98101',
    country: 'United States',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('credit_card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect or prompt
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold font-display text-stone-900">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-stone-600">
          Please add architectural objects to your bag before proceeding to checkout.
        </p>
        <button
          onClick={() => navigate('/catalog')}
          className="px-5 py-2.5 bg-stone-900 text-stone-50 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors inline-block"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  const shippingFee = shippingMethod === 'standard' ? (cartSubtotal >= 300 ? 0 : 25) : 65;
  const estimatedTax = Math.round(cartSubtotal * 0.08 * 100) / 100;
  const orderTotal = cartSubtotal + shippingFee + estimatedTax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const createdOrder = placeOrder(address, paymentMethod, shippingFee);
      setIsSubmitting(false);
      navigate(`/order-confirmation/${createdOrder.orderId}`);
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <button
          onClick={() => navigate('/catalog')}
          className="flex items-center gap-1.5 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Catalog</span>
        </button>
        <div className="flex items-center gap-1.5 font-mono text-stone-700">
          <Lock className="w-3.5 h-3.5 text-stone-500" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Checkout Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
          {/* 1. Shipping Details */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-mono text-xs font-bold">
                1
              </span>
              <h2 className="text-base font-bold font-display text-stone-900">
                Delivery Destination
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-medium text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-stone-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    required
                    value={address.stateProvince}
                    onChange={(e) => setAddress({ ...address, stateProvince: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Freight Shipping Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-mono text-xs font-bold">
                2
              </span>
              <h2 className="text-base font-bold font-display text-stone-900">
                Freight Logistics
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <label
                onClick={() => setShippingMethod('standard')}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  shippingMethod === 'standard'
                    ? 'border-stone-900 bg-stone-50 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-stone-700" />
                  <div>
                    <div className="font-semibold text-stone-900">
                      Standard White-Glove Ground
                    </div>
                    <div className="text-stone-500 text-[11px]">
                      3–5 business days with scheduled room-of-choice placement
                    </div>
                  </div>
                </div>
                <div className="font-mono font-bold text-stone-900">
                  {cartSubtotal >= 300 ? 'Complimentary' : formatPrice(25)}
                </div>
              </label>

              <label
                onClick={() => setShippingMethod('express')}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  shippingMethod === 'express'
                    ? 'border-stone-900 bg-stone-50 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-stone-700" />
                  <div>
                    <div className="font-semibold text-stone-900">
                      Expedited Priority Freight
                    </div>
                    <div className="text-stone-500 text-[11px]">
                      1–2 business days guaranteed air dispatch
                    </div>
                  </div>
                </div>
                <div className="font-mono font-bold text-stone-900">
                  {formatPrice(65)}
                </div>
              </label>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-mono text-xs font-bold">
                3
              </span>
              <h2 className="text-base font-bold font-display text-stone-900">
                Payment Method
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'border-stone-900 bg-stone-50 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <CreditCard className="w-4 h-4 text-stone-700 mb-2" />
                <span className="font-semibold text-stone-900">Credit Card</span>
                <span className="text-[10px] text-stone-500 font-mono">Visa / Master / Amex</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'border-stone-900 bg-stone-50 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="w-4 h-4 text-stone-900 mb-2 font-bold font-display"></div>
                <span className="font-semibold text-stone-900">Apple Pay / GPay</span>
                <span className="text-[10px] text-stone-500 font-mono">Biometric One-Touch</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-stone-900 bg-stone-50 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <Banknote className="w-4 h-4 text-stone-700 mb-2" />
                <span className="font-semibold text-stone-900">Cash on Delivery</span>
                <span className="text-[10px] text-stone-500 font-mono">Pay Upon Inspection</span>
              </button>
            </div>

            {paymentMethod === 'credit_card' && (
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    defaultValue="•••• •••• •••• 4242"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-900 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Expiry
                    </label>
                    <input
                      type="text"
                      defaultValue="12/28"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      defaultValue="883"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-900 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cash_on_delivery' && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-semibold">Cash On Delivery Terms Verified</p>
                <p className="text-[11px] leading-relaxed">
                  Our freight team will present physical objects for your architectural inspection before accepting payment. Exact cash or certified cashier's check accepted.
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authorizing Transaction...</span>
            ) : (
              <>
                <span>Complete Purchase & Dispatch Order</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{formatPrice(orderTotal)}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Right: Sticky Order Summary */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs lg:sticky lg:top-24 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <h3 className="font-bold font-display text-stone-900 text-base">
              Order Summary
            </h3>
            <span className="text-xs font-mono text-stone-500">
              {cart.length} line items
            </span>
          </div>

          {/* Items */}
          <div className="space-y-4 max-h-72 overflow-y-auto divide-y divide-stone-100 pr-1">
            {cart.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex gap-3 text-xs">
                <div className="w-14 h-14 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                  <OptimizedImage
                    src={item.product.images.hero}
                    alt={item.product.name}
                    aspectRatio="1/1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-stone-900 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate">
                    {item.variant.name}
                  </p>
                  <p className="text-[11px] text-stone-600 font-mono mt-0.5">
                    Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <div className="font-mono tabular-nums font-bold text-stone-900">
                  {formatPrice(item.unitPrice * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Calculations */}
          <div className="space-y-2 pt-4 border-t border-stone-200 text-xs">
            <div className="flex items-center justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums text-stone-900">
                {formatPrice(cartSubtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-stone-600">
              <span>Freight Shipping</span>
              <span className="font-mono tabular-nums text-stone-900">
                {shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}
              </span>
            </div>
            <div className="flex items-center justify-between text-stone-600">
              <span>Estimated Sales Tax (8%)</span>
              <span className="font-mono tabular-nums text-stone-900">
                {formatPrice(estimatedTax)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-stone-950 pt-3 border-t border-stone-200">
              <span>Total Due</span>
              <span className="font-mono tabular-nums text-base">
                {formatPrice(orderTotal)}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-500 space-y-1.5">
            <div className="flex items-center gap-1.5 text-stone-800 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Return & Authenticity Guarantee</span>
            </div>
            <p className="leading-relaxed">
              Every shipment is insured for its full architectural valuation. Packaging is engineered from 100% biodegradable fiber.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
