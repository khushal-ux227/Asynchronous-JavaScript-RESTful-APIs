import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { OptimizedImage } from '../components/common/OptimizedImage';
import { ProductCategory } from '../types/ecommerce';
import { Search, SlidersHorizontal, ArrowUpDown, Check, X, Heart } from 'lucide-react';

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'All Objects' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'tableware', label: 'Tableware' },
  { id: 'objects', label: 'Objects & Accents' },
];

export function CatalogPage() {
  const { query, navigate } = useRouter();
  const { formatPrice, addToCart, toggleWishlist, isWishlisted } = useShop();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(() => {
    const fromQuery = query.category as ProductCategory;
    return fromQuery && ['furniture', 'lighting', 'tableware', 'objects'].includes(fromQuery)
      ? fromQuery
      : 'all';
  });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [priceMax, setPriceMax] = useState<number>(2000);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Sync with URL query changes (e.g. clicking Lighting in Header)
  useEffect(() => {
    if (query.category) {
      setSelectedCategory(query.category as ProductCategory);
    }
  }, [query.category]);

  // Filtered & Sorted products calculation
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(term);
        const matchesDesigner = item.designer.toLowerCase().includes(term);
        const matchesDesc = item.description.toLowerCase().includes(term);
        const matchesMaterial = item.materials.some((m) => m.toLowerCase().includes(term));
        if (!matchesName && !matchesDesigner && !matchesDesc && !matchesMaterial) {
          return false;
        }
      }
      // In stock
      if (inStockOnly && !item.inStock) {
        return false;
      }
      // Price
      if (item.price > priceMax) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, searchTerm, inStockOnly, priceMax, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setInStockOnly(false);
    setPriceMax(2000);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Heading */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider mb-1.5">
            <span>Storefront Catalog</span>
            <span aria-hidden="true">·</span>
            <span>Client-Side Filtering & Search</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-stone-950 tracking-tight">
            Curated Catalog
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-xl">
            Browse our full repertoire of solid timber furniture, travertine stone lamps, and cast metal wares.
          </p>
        </div>

        <div className="text-xs font-mono text-stone-500">
          Showing <span className="font-bold text-stone-900">{filteredProducts.length}</span> of {PRODUCTS.length} objects
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Tabs (Segmented control) */}
        <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-xl overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search objects, timber, stone..."
              className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-8 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Toggle In-Stock Only */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              inStockOnly
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${inStockOnly ? 'bg-emerald-400' : 'bg-stone-400'}`} />
            <span>In Stock Only</span>
          </button>
        </div>
      </div>

      {/* Active filters notice if any */}
      {(searchTerm || selectedCategory !== 'all' || inStockOnly || priceMax < 2000) && (
        <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
          <span>Active criteria:</span>
          {selectedCategory !== 'all' && (
            <span className="font-mono text-stone-800 bg-stone-200/60 px-2 py-0.5 rounded">
              Category: {selectedCategory}
            </span>
          )}
          {searchTerm && (
            <span className="font-mono text-stone-800 bg-stone-200/60 px-2 py-0.5 rounded">
              Search: "{searchTerm}"
            </span>
          )}
          {inStockOnly && (
            <span className="font-mono text-stone-800 bg-stone-200/60 px-2 py-0.5 rounded">
              In Stock Only
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-stone-700 hover:text-stone-950 underline underline-offset-2 ml-2"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-stone-100 rounded-3xl border border-stone-200 space-y-3">
          <h3 className="text-base font-bold text-stone-900 font-display">
            No objects match your criteria
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search query or reset the category filters to discover all items.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const wishlisted = isWishlisted(product.id);
            return (
              <article
                key={product.id}
                onClick={() => navigate(`/product/${product.slug}`)}
                className="group cursor-pointer bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative overflow-hidden bg-stone-100 aspect-[4/3]">
                    <OptimizedImage
                      src={product.images.hero}
                      alt={product.name}
                      aspectRatio="4/3"
                      className="group-hover:scale-102 transition-transform duration-300"
                    />

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 transition-colors shadow-xs"
                      aria-label="Toggle wishlist"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          wishlisted ? 'fill-rose-600 text-rose-600' : ''
                        }`}
                      />
                    </button>

                    {/* Badge if available */}
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-stone-900/90 text-stone-100 text-[10px] font-mono px-2 py-0.5 rounded tracking-wide">
                        {product.badge}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono">
                      <span>{product.designer}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.categoryLabel}</span>
                    </div>

                    <h3 className="mt-1 text-sm font-bold text-stone-900 font-display group-hover:text-stone-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Card Baseline */}
                <div className="px-4 pb-4 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-mono font-bold text-stone-900 tabular-nums">
                      {formatPrice(product.price)}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {product.inStock ? `${product.inventoryCount} units ready` : 'Made to order'}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, product.variants[0], 1);
                    }}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-900 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
