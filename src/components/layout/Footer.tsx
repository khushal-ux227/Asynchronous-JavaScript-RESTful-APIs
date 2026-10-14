import React from 'react';
import { useRouter } from '../../context/RouterContext';

export function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="border-t border-stone-200 bg-stone-100 text-stone-700 text-sm mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Philosophy */}
          <div className="md:col-span-1 space-y-3">
            <h3 className="font-bold text-stone-900 font-display text-base tracking-tight">
              AURA OBJECTS
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Quiet architectural furniture, sculptural stone lighting, and precision craft goods.
              Designed for enduring spaces.
            </p>
            <div className="pt-2 text-xs text-stone-500 font-mono">
              Web Development Capstone Project
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/catalog?category=furniture')}
                  className="hover:text-stone-950 transition-colors"
                >
                  Solid Timber Seating
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/catalog?category=lighting')}
                  className="hover:text-stone-950 transition-colors"
                >
                  Travertine & Spun Brass Lighting
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/catalog?category=tableware')}
                  className="hover:text-stone-950 transition-colors"
                >
                  Induction & Tableware
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/catalog?category=objects')}
                  className="hover:text-stone-950 transition-colors"
                >
                  Cast Bronze & Geological Accents
                </button>
              </li>
            </ul>
          </div>

          {/* Capstone & Engineering */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Architecture & DevOps
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/deployment')}
                  className="hover:text-stone-950 transition-colors"
                >
                  Modular Frontend Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/deployment')}
                  className="hover:text-stone-950 transition-colors"
                >
                  Asset & Code Optimization
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/deployment')}
                  className="hover:text-stone-950 transition-colors"
                >
                  Vercel / Netlify / Render Blueprints
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/orders')}
                  className="hover:text-stone-950 transition-colors"
                >
                  Client-Side State & Order Engine
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Client Services
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>Complimentary freight delivery on orders over $300</li>
              <li>30-day architectural return window</li>
              <li>White-glove assembly & packaging recycle</li>
              <li>Material swatch samples upon consultation</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 AURA Objects Studio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Client Routing: History API & Hash Anchor</span>
            <span aria-hidden="true">·</span>
            <span>WCAG AA Tested</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => navigate('/deployment')}
              className="text-stone-800 hover:text-stone-950 font-medium underline underline-offset-4"
            >
              DevOps Spec
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
