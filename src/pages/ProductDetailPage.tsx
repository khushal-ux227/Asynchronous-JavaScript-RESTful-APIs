import React, { useState, useMemo } from 'react';
import { useRouter } from '../context/RouterContext';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, REVIEWS_DATABASE } from '../data/products';
import { OptimizedImage } from '../components/common/OptimizedImage';
import { ProductVariant } from '../types/ecommerce';
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Plus,
  Minus,
  Star,
  Layers,
  Ruler,
  Sparkles,
} from 'lucide-react';

export function ProductDetailPage() {
  const { params, navigate } = useRouter();
  const { formatPrice, addToCart, toggleWishlist, isWishlisted } = useShop();

  const idOrSlug = params.idOrSlug || '';

  const product = useMemo(() => {
    return (
      PRODUCTS.find((p) => p.slug === idOrSlug || p.id === idOrSlug) ||
      PRODUCTS[0]
    );
  }, [idOrSlug]);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    product.images.hero
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'dimensions' | 'reviews'>('specs');

  // Keep variant and image in sync when product changes
  React.useEffect(() => {
    setSelectedVariant(product.variants[0]);
    setSelectedImage(product.images.hero);
    setQuantity(1);
  }, [product]);

  const wishlisted = isWishlisted(product.id);
  const effectivePrice = product.price + selectedVariant.priceDelta;
  const reviews = REVIEWS_DATABASE[product.id] || [];

  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);
  }, [product]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <button
          onClick={() => navigate('/catalog')}
          className="flex items-center gap-1.5 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-1.5 font-mono">
          <span>Catalog</span>
          <span aria-hidden="true">/</span>
          <span className="capitalize">{product.category}</span>
          <span aria-hidden="true">/</span>
          <span className="text-stone-900 font-medium truncate max-w-[180px]">{product.name}</span>
        </div>
      </div>

      {/* Main PDP Grid: Gallery Left (Sticky), Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
          {/* Main Hero Shot */}
          <div className="rounded-3xl overflow-hidden border border-stone-200 bg-stone-100 aspect-[4/3] relative">
            <OptimizedImage
              src={selectedImage}
              alt={product.name}
              aspectRatio="4/3"
              priority
              className="w-full h-full"
            />
            {product.badge && (
              <div className="absolute top-4 left-4 bg-stone-900/90 text-stone-100 text-[11px] font-mono px-3 py-1 rounded tracking-wide backdrop-blur-xs">
                {product.badge}
              </div>
            )}
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex items-center gap-3">
            {[
              { label: 'Hero View', src: product.images.hero },
              { label: 'Detail View', src: product.images.detail },
              ...(product.images.ambient
                ? [{ label: 'Ambient View', src: product.images.ambient }]
                : []),
            ].map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img.src)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === img.src
                    ? 'border-stone-900 shadow-sm'
                    : 'border-stone-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div>
            {/* Unboxed Metadata (NO PILL) */}
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider">
              <span>{product.designer}</span>
              <span aria-hidden="true">·</span>
              <span>{product.categoryLabel}</span>
            </div>

            <h1 className="mt-2 text-2xl sm:text-3xl font-bold font-display text-stone-950 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating & Review count */}
            <div className="flex items-center gap-2 mt-2 text-xs text-stone-600">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="ml-1 font-mono font-bold text-stone-900">{product.rating}</span>
              </div>
              <span aria-hidden="true">·</span>
              <span className="text-stone-500 underline cursor-pointer" onClick={() => setActiveTab('reviews')}>
                {product.reviewCount} verified reviews
              </span>
            </div>
          </div>

          {/* Pricing & Stock Status */}
          <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-950 tabular-nums">
                {formatPrice(effectivePrice)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm font-mono text-stone-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            <div className="text-right">
              {selectedVariant.inStock ? (
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>{selectedVariant.inventoryCount} units available</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-medium text-amber-800">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Made to order (2-3 weeks)</span>
                </div>
              )}
              <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                {product.leadTime}
              </div>
            </div>
          </div>

          {/* Short Narrative */}
          <p className="text-xs text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {/* Variant Selector */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-900">Finish & Material</span>
              <span className="font-mono text-stone-500">{selectedVariant.colorName}</span>
            </div>

            <div className="space-y-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                    selectedVariant.id === v.id
                      ? 'border-stone-900 bg-stone-50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full border border-stone-300 shrink-0"
                      style={{ backgroundColor: v.hexColor }}
                    />
                    <div>
                      <span className="font-medium text-stone-900">{v.name}</span>
                      <span className="text-stone-500 font-mono text-[11px] block">
                        SKU: {v.sku}
                      </span>
                    </div>
                  </div>
                  {v.priceDelta !== 0 && (
                    <span className="font-mono text-[11px] text-stone-600 font-medium">
                      {v.priceDelta > 0 ? `+${formatPrice(v.priceDelta)}` : `-${formatPrice(Math.abs(v.priceDelta))}`}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart Controls */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 hover:bg-white rounded text-stone-700 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-mono font-bold text-stone-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 hover:bg-white rounded text-stone-700 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Primary Buy Button */}
              <button
                onClick={() => addToCart(product, selectedVariant, quantity)}
                className="flex-1 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Add to Shopping Bag</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {formatPrice(effectivePrice * quantity)}
                </span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-lg border transition-colors ${
                  wishlisted
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-stone-300 hover:border-stone-400 text-stone-700 hover:text-stone-900'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-2 grid grid-cols-2 gap-3 text-[11px] text-stone-500">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Complimentary White-Glove</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>30-Day In-Home Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Technical Specifications, Architectural Dimensions, Customer Reviews */}
      <div className="border-t border-stone-200 pt-10">
        <div className="flex items-center gap-6 border-b border-stone-200 pb-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 transition-colors ${
              activeTab === 'specs'
                ? 'text-stone-950 border-b-2 border-stone-950 -mb-3.5'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Material Specs & Craftsmanship
          </button>
          <button
            onClick={() => setActiveTab('dimensions')}
            className={`pb-3 transition-colors ${
              activeTab === 'dimensions'
                ? 'text-stone-950 border-b-2 border-stone-950 -mb-3.5'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Architectural Dimensions
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors ${
              activeTab === 'reviews'
                ? 'text-stone-950 border-b-2 border-stone-950 -mb-3.5'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Client Reviews ({reviews.length})
          </button>
        </div>

        <div className="py-8">
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
              <div className="space-y-4">
                <h4 className="font-semibold text-stone-900 font-display text-sm">
                  Material Composition
                </h4>
                <ul className="space-y-2">
                  {product.materials.map((m, i) => (
                    <li key={i} className="flex items-center gap-2 text-stone-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="font-semibold text-stone-900 font-display text-sm pt-4">
                  Maintenance & Patina
                </h4>
                <p className="text-stone-600 leading-relaxed">
                  {product.careInstructions}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-stone-900 font-display text-sm">
                  Structural Highlights
                </h4>
                <ul className="space-y-2.5">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-stone-600">
                      <Check className="w-3.5 h-3.5 text-stone-900 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'dimensions' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-stone-100 border border-stone-200">
                <div className="font-mono text-stone-500 text-[11px]">WIDTH</div>
                <div className="text-lg font-mono font-bold text-stone-900 mt-1 tabular-nums">
                  {product.dimensions.widthCm} cm
                </div>
                <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                  {(product.dimensions.widthCm / 2.54).toFixed(1)} inches
                </div>
              </div>
              <div className="p-4 rounded-xl bg-stone-100 border border-stone-200">
                <div className="font-mono text-stone-500 text-[11px]">DEPTH</div>
                <div className="text-lg font-mono font-bold text-stone-900 mt-1 tabular-nums">
                  {product.dimensions.depthCm} cm
                </div>
                <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                  {(product.dimensions.depthCm / 2.54).toFixed(1)} inches
                </div>
              </div>
              <div className="p-4 rounded-xl bg-stone-100 border border-stone-200">
                <div className="font-mono text-stone-500 text-[11px]">HEIGHT</div>
                <div className="text-lg font-mono font-bold text-stone-900 mt-1 tabular-nums">
                  {product.dimensions.heightCm} cm
                </div>
                <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                  {(product.dimensions.heightCm / 2.54).toFixed(1)} inches
                </div>
              </div>
              <div className="p-4 rounded-xl bg-stone-100 border border-stone-200">
                <div className="font-mono text-stone-500 text-[11px]">NET MASS</div>
                <div className="text-lg font-mono font-bold text-stone-900 mt-1 tabular-nums">
                  {product.dimensions.weightKg} kg
                </div>
                <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                  {(product.dimensions.weightKg * 2.20462).toFixed(1)} lbs
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-xs text-stone-500 italic">
                  Be the first interior architect to leave a verified review for this piece.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-stone-100 border border-stone-200 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="font-mono text-stone-400 text-[11px]">{rev.date}</span>
                      </div>
                      <h5 className="font-bold text-stone-900">{rev.title}</h5>
                      <p className="text-stone-600 leading-relaxed">{rev.comment}</p>
                      <div className="flex items-center gap-2 pt-2 text-[11px] text-stone-500 font-mono">
                        <span>{rev.author}</span>
                        <span aria-hidden="true">·</span>
                        <span>{rev.location}</span>
                        {rev.verifiedBuyer && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-stone-700 font-medium">Verified Client</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Collection Grid */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-stone-200 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-display text-stone-950">
              Related Collection Pieces
            </h3>
            <button
              onClick={() => navigate('/catalog')}
              className="text-xs font-semibold text-stone-800 hover:text-stone-950"
            >
              View Full Catalog
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <article
                key={rel.id}
                onClick={() => navigate(`/product/${rel.slug}`)}
                className="cursor-pointer group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
                  <OptimizedImage
                    src={rel.images.hero}
                    alt={rel.name}
                    aspectRatio="4/3"
                    className="group-hover:scale-102 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="text-[11px] font-mono text-stone-500">{rel.categoryLabel}</div>
                  <h4 className="text-xs font-bold text-stone-900 mt-1 line-clamp-1">{rel.name}</h4>
                  <div className="text-xs font-mono font-bold text-stone-900 mt-2">
                    {formatPrice(rel.price)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
