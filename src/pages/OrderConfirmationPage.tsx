import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useShop } from '../context/ShopContext';
import { OptimizedImage } from '../components/common/OptimizedImage';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  Printer,
  ChevronRight,
} from 'lucide-react';

export function OrderConfirmationPage() {
  const { params, navigate } = useRouter();
  const { getOrderById, formatPrice, orders } = useShop();

  const orderId = params.orderId || '';
  const order = getOrderById(orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-display text-stone-900">
          Order Not Found
        </h2>
        <p className="text-xs text-stone-600">
          We could not locate this order identifier. Please check your order history.
        </p>
        <button
          onClick={() => navigate('/orders')}
          className="px-4 py-2 bg-stone-900 text-stone-50 rounded-lg text-xs font-semibold"
        >
          View Orders
        </button>
      </div>
    );
  }

  const steps = [
    { title: 'Order Confirmed', date: 'Immediate', done: true },
    { title: 'Artisan Packaging', date: 'In Progress', done: true },
    { title: 'White-Glove Dispatch', date: 'Expected Tomorrow', done: order.status !== 'confirmed' },
    { title: 'Delivered', date: order.estimatedDelivery, done: order.status === 'delivered' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Success Notification Banner */}
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-7 h-7 stroke-[2]" />
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider">
          <span>Official Confirmation</span>
          <span aria-hidden="true">·</span>
          <span>Receipt Issued</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-950 tracking-tight">
          Thank you. Your order #{order.orderId} is confirmed.
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          A receipt and tracking dispatch notification has been scheduled for{' '}
          <span className="font-semibold text-stone-900">{order.shippingAddress.email}</span>.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-stone-300 hover:border-stone-400 bg-stone-50 rounded-lg text-xs font-medium text-stone-800 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 rounded-lg text-xs font-medium text-white transition-colors flex items-center gap-1.5"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Tracking Progress Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
          <div>
            <h3 className="font-bold font-display text-stone-900 text-base">
              Dispatch & Logistics Timeline
            </h3>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Carrier: {order.carrier} · Tracking: {order.trackingNumber}
            </p>
          </div>
          <div className="text-xs font-mono text-stone-700 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200 self-start sm:self-auto">
            ETA: {order.estimatedDelivery}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-xs space-y-1 transition-all ${
                step.done
                  ? 'bg-stone-50 border-stone-900'
                  : 'bg-stone-100/50 border-stone-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-stone-500">
                <span>0{idx + 1}.</span>
                <span>{step.date}</span>
              </div>
              <h4 className="font-bold text-stone-900">{step.title}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Order Item Details & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Purchased Items */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-bold font-display text-stone-900 text-sm border-b border-stone-200 pb-3">
            Purchased Specimens ({order.items.length})
          </h3>
          <div className="divide-y divide-stone-100 space-y-3">
            {order.items.map((item) => (
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

          <div className="pt-4 border-t border-stone-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums text-stone-900">
                {formatPrice(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>White-Glove Freight</span>
              <span className="font-mono tabular-nums text-stone-900">
                {order.shippingFee === 0 ? 'Complimentary' : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Tax (8%)</span>
              <span className="font-mono tabular-nums text-stone-900">
                {formatPrice(order.tax)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200 text-sm">
              <span>Total Paid</span>
              <span className="font-mono tabular-nums">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment summary */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-5 text-xs">
          <div>
            <h3 className="font-bold font-display text-stone-900 text-sm border-b border-stone-200 pb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Destination Address</span>
            </h3>
            <div className="mt-3 text-stone-700 space-y-1 leading-relaxed">
              <p className="font-semibold text-stone-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.stateProvince}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="text-stone-500 font-mono mt-1">{order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200">
            <h4 className="font-semibold text-stone-900">Payment Authorization</h4>
            <p className="text-stone-600 mt-1 capitalize">
              Method: {order.paymentMethod.replace('_', ' ')}
            </p>
            <p className="text-stone-400 font-mono text-[11px] mt-0.5">
              Authorized at {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200">
            <h5 className="font-bold text-stone-900">White-Glove Service Guarantee</h5>
            <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
              The delivery team will phone you 2 hours prior to arrival for room-of-choice placement and debris recycling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
