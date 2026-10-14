import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, ASSET_HERO_FURNITURE } from '../data/products';
import { OptimizedImage } from '../components/common/OptimizedImage';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Terminal, Layers, Cpu } from 'lucide-react';

export function HomePage() {
  const { navigate } = useRouter();
  const { formatPrice, addToCart } = useShop();

  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured);

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Storefront Hero: 1 Bold Campaign Focal Point */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-stone-100 rounded-3xl overflow-hidden border border-stone-200">
          {/* Left Text Column */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
            <div>
              {/* Unboxed subtle kicker (NO PILL) */}
              <div className="flex items-center gap-2 text-xs text-stone-500 font-mono mb-4 uppercase tracking-wider">
                <span>Drop 04</span>
                <span aria-hidden="true">·</span>
                <span>Autumn Edition</span>
                <span aria-hidden="true">·</span>
                <span>Crafted in Europe</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-stone-950 tracking-tight leading-[1.1] text-balance">
                Architectural forms for enduring living.
              </h1>

              <p className="mt-5 text-sm sm:text-base text-stone-600 leading-relaxed max-w-md">
                Tactile stone lighting, sculpted solid oak armchairs, and hand-finished table objects.
                Engineered with quiet proportions and natural materials.
              </p>
            </div>

            <div className="pt-8 sm:pt-12 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/catalog')}
                  className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span>Explore 2026 Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/deployment')}
                  className="px-4 py-3 bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4 text-stone-500" />
                  <span>Capstone DevOps Spec</span>
                </button>
              </div>

              {/* Quiet adjacent proof claim */}
              <p className="text-xs text-stone-500 font-mono">
                100% Solid timber & certified Roman travertine stone.
              </p>
            </div>
          </div>

          {/* Right Hero Image Column */}
          <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[460px] lg:h-full">
            <img
              src={ASSET_HERO_FURNITURE}
              alt="Scandinavian minimalist architectural living space with sculpted oak lounge chair"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>

        {/* 4-Column Proof & Service Strip (Full-width row below hero) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 text-xs text-stone-600">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-stone-100/60 border border-stone-200/80">
            <Truck className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-stone-900">Complimentary Freight</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Free delivery on orders over $300</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-stone-100/60 border border-stone-200/80">
            <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-stone-900">5-Year Structural Warranty</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Guaranteed joinery & stone integrity</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-stone-100/60 border border-stone-200/80">
            <RefreshCw className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-stone-900">30-Day Trial</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Risk-free architectural inspection</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-stone-100/60 border border-stone-200/80">
            <Terminal className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-stone-900">Modular Web Architecture</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">SPA routing & zero runtime overhead</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Collection Grid: 3-column desktop / uniform cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider mb-1">
              <span>Curated Selection</span>
              <span aria-hidden="true">·</span>
              <span>Available to Order</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-950 tracking-tight">
              Masterwork Objects
            </h2>
          </div>
          <button
            onClick={() => navigate('/catalog')}
            className="text-xs font-semibold text-stone-900 hover:text-stone-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto group"
          >
            <span>View All 8 Objects</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <article
              key={product.id}
              onClick={() => navigate(`/product/${product.slug}`)}
              className="group cursor-pointer bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Product Card Image: takes ~70% of card height */}
                <div className="relative overflow-hidden bg-stone-100 aspect-[4/3]">
                  <OptimizedImage
                    src={product.images.hero}
                    alt={product.name}
                    aspectRatio="4/3"
                    className="group-hover:scale-102 transition-transform duration-300"
                  />
                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-stone-900/90 text-stone-100 text-[10px] font-mono font-medium px-2 py-0.5 rounded tracking-wide backdrop-blur-xs">
                      {product.badge}
                    </div>
                  )}
                </div>

                {/* Card Metadata (Clean unboxed text) */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                    <span>{product.designer}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.categoryLabel}</span>
                  </div>

                  <h3 className="mt-1 text-base font-bold text-stone-900 font-display group-hover:text-stone-700 transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="mt-1.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>
              </div>

              {/* Price & Quick Buy Baseline */}
              <div className="px-5 pb-5 pt-2 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="text-base font-mono font-bold text-stone-900 tabular-nums">
                    {formatPrice(product.price)}
                  </div>
                  {product.compareAtPrice && (
                    <div className="text-[11px] text-stone-400 font-mono line-through">
                      {formatPrice(product.compareAtPrice)}
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, product.variants[0], 1);
                  }}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-900 text-xs font-semibold rounded-lg transition-colors"
                >
                  Quick Add
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Craftsmanship & Material Philosophy (Claim-to-Proof Adjacency) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-400 font-mono uppercase tracking-wider mb-3">
                <span>Material Purity</span>
                <span aria-hidden="true">·</span>
                <span>Honest Form</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white tracking-tight">
                Objects reduced to their essential material soul.
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
                We reject synthetic composites and ephemeral trends. Every joint is honest, every
                surface celebrates its natural geological or biological origin. Roman travertine cut
                from subterranean quarries; solid European oak harvested under strict regeneration
                guidelines; spun solid brass that records the touch of generations.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-stone-800 pt-6">
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                    0%
                  </div>
                  <div className="text-xs text-stone-400 mt-1">Synthetic particleboard or veneer foam</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                    100%
                  </div>
                  <div className="text-xs text-stone-400 mt-1">Recyclable cardboard & molded paper pulp</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-stone-800/70 border border-stone-700/60">
                  <h4 className="text-xs font-bold text-stone-100 font-mono uppercase tracking-wider">
                    01. Solid White Oak
                  </h4>
                  <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                    Sustainably cut timber air-dried for 18 months, finished exclusively with organic cold-pressed wax.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-stone-800/70 border border-stone-700/60">
                  <h4 className="text-xs font-bold text-stone-100 font-mono uppercase tracking-wider">
                    02. Roman Travertine
                  </h4>
                  <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                    Raw porous limestone celebrating unsealed subterranean voids and distinctive calcite veining.
                  </p>
                </div>
              </div>
              <div className="space-y-4 pt-6">
                <div className="p-5 rounded-2xl bg-stone-800/70 border border-stone-700/60">
                  <h4 className="text-xs font-bold text-stone-100 font-mono uppercase tracking-wider">
                    03. Spun Raw Brass
                  </h4>
                  <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                    High copper alloys left unlacquered to develop a deep, personalized patina over years of touch.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-stone-800/70 border border-stone-700/60">
                  <h4 className="text-xs font-bold text-stone-100 font-mono uppercase tracking-wider">
                    04. Belgian Linen
                  </h4>
                  <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                    Master of Linen certified flax yarn, woven without petroleum binders or harsh chlorine bleaches.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DevOps & Capstone Engineering Architecture Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-stone-100 border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider">
              <span>Capstone Project Architecture</span>
              <span aria-hidden="true">·</span>
              <span>Full-Stack Ready</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-stone-900 tracking-tight">
              Engineered for Instant Deployment to Vercel, Netlify, or Render
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Explore the complete project architecture: client-side routing, asset optimization pipeline,
              reproducible build scripts, and production configurations.
            </p>
          </div>

          <button
            onClick={() => navigate('/deployment')}
            className="px-5 py-3 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-2 shrink-0 shadow-sm"
          >
            <Layers className="w-4 h-4" />
            <span>Launch Deployment Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
