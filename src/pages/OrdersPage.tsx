import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useShop } from '../context/ShopContext';
import { OptimizedImage } from '../components/common/OptimizedImage';
import { Package, Truck, ArrowRight, ExternalLink } from 'lucide-react';

export function OrdersPage() {
  const { orders, formatPrice } = useShop();
  const { navigate } = useRouter();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-stone-200 pb-5 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider mb-1">
            <span>Client Portal</span>
            <span aria-hidden="true">·</span>
            <span>Order History</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-stone-950 tracking-tight">
            Order History & Tracking
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Review your confirmed purchases, view live dispatch logistics, and access printable receipts.
          </p>
        </div>

        <button
          onClick={() => navigate('/catalog')}
          className="text-xs font-semibold text-stone-900 hover:text-stone-700 hidden sm:block"
        >
          Continue Shopping
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-stone-100 rounded-3xl border border-stone-200 space-y-3">
          <Package className="w-8 h-8 text-stone-400 mx-auto stroke-[1.5]" />
          <h3 className="text-base font-bold text-stone-900 font-display">
            No orders placed yet
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Once you complete an order from the catalog, its live freight tracking timeline and itemized receipt will appear here.
          </p>
          <button
            onClick={() => navigate('/catalog')}
            className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs"
            >
              {/* Order Header */}
              <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-stone-400 font-mono text-[11px] block">
                      ORDER PLACED
                    </span>
                    <span className="font-medium text-stone-900">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-400 font-mono text-[11px] block">TOTAL</span>
                    <span className="font-mono font-bold text-stone-900 tabular-nums">
                      {formatPrice(order.total)}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-400 font-mono text-[11px] block">SHIP TO</span>
                    <span className="font-medium text-stone-900">
                      {order.shippingAddress.fullName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-stone-900 bg-stone-200/70 px-2.5 py-1 rounded-md">
                    #{order.orderId}
                  </span>
                  <button
                    onClick={() => navigate(`/order-confirmation/${order.orderId}`)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <span>Track Freight</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4 text-xs font-medium text-emerald-800">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>
                    Status: <strong className="capitalize">{order.status}</strong> · Estimated: {order.estimatedDelivery}
                  </span>
                </div>

                <div className="divide-y divide-stone-100 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-4 text-xs">
                      <div className="w-14 h-14 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        <OptimizedImage
                          src={item.product.images.hero}
                          alt={item.product.name}
                          aspectRatio="1/1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          onClick={() => navigate(`/product/${item.product.slug}`)}
                          className="font-semibold text-stone-900 hover:underline cursor-pointer truncate"
                        >
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-stone-500">{item.variant.name}</p>
                        <p className="text-[11px] text-stone-600 font-mono mt-0.5">
                          Qty: {item.quantity} · {formatPrice(item.unitPrice)} each
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/product/${item.product.slug}`)}
                        className="px-3 py-1.5 border border-stone-300 hover:border-stone-400 rounded-lg text-xs font-medium text-stone-800 transition-colors"
                      >
                        Buy Again
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
