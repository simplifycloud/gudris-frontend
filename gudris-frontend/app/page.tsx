'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (data) setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans">
      <div className="bg-stone-900 text-stone-100 text-xs py-2 text-center tracking-widest uppercase">
        Handmade Heritage • Free Shipping Across India • 100% Sustainable
      </div>

      <header className="border-b border-stone-200 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-2xl font-serif tracking-wider uppercase font-bold text-stone-800">
          Gudris<span className="text-amber-700">.</span>
        </h1>
        <button className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-full text-sm">
          <ShoppingBag size={16} />
          <span>Bag ({cartCount})</span>
        </button>
      </header>

      <section className="px-6 py-16 text-center max-w-3xl mx-auto">
        <span className="text-amber-800 tracking-widest text-xs uppercase font-semibold">Authentic Slow Craft</span>
        <h2 className="text-4xl md:text-5xl font-serif mt-3 text-stone-900">
          Every stitch tells a story of heritage & care.
        </h2>
        <p className="mt-3 text-stone-600">
          Handmade Gudri quilts and artisanal home goods, crafted sustainably by women artisans.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-8">
        <h3 className="text-2xl font-serif mb-6">Our Collection</h3>
        {products.length === 0 ? (
          <p className="text-stone-400">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm">
                <div className="aspect-square bg-stone-100 overflow-hidden">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h4 className="font-serif text-lg font-medium">{item.name}</h4>
                  <p className="text-xs text-stone-500 mt-1">{item.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold">₹{item.price}</span>
                    <button 
                      onClick={() => setCartCount(c => c + 1)}
                      className="bg-stone-900 hover:bg-amber-800 text-white px-3 py-1.5 text-xs uppercase tracking-wider rounded"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}