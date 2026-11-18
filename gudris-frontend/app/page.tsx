'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  X, 
  Plus, 
  Minus, 
  MessageCircle, 
  Star 
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

// Default realistic products so your store is NEVER empty
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vintage Kantha Indigo Gudri Quilt',
    price: 2499,
    category: 'Quilts',
    description: '100% upcycled vintage cotton layered with dense hand-done running Kantha stitches. Breathable and cozy.',
    image_url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    name: 'Terracotta Earth Bohemian Gudri Throw',
    price: 1899,
    category: 'Throws',
    description: 'Rustic natural dyes hand-stitched by rural women artisans. Perfect accent for living rooms or sofas.',
    image_url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    name: 'Artisan Patchwork Gudri Tote Bag',
    price: 899,
    category: 'Bags',
    description: 'Zero-waste tote bag crafted from remnant vintage fabrics with reinforced double-stitched straps.',
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    name: 'Floral Heritage Kantha Cushion Cover (Set of 2)',
    price: 1199,
    category: 'Cushions',
    description: 'Set of two matching Gudri cushion covers featuring vibrant contrast stitching and envelope closure.',
    image_url: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    name: 'Sage Botanical Reversible Gudri Razai',
    price: 2899,
    category: 'Quilts',
    description: 'Twin-layer reversible cotton quilt with intricate micro-stitching. Extra soft feel that softens with every wash.',
    image_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '6',
    name: 'Monochrome Geometric Gudri Laptop Sleeve',
    price: 749,
    category: 'Bags',
    description: 'Padded Kantha quilted laptop protective sleeve made with recycled cotton and wooden button clasp.',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
  }
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Replace with your real WhatsApp number (including country code, e.g., 919876543210)
  const WHATSAPP_NUMBER = '919876543210';

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.log('Using default catalog:', err);
      }
    }
    fetchProducts();
  }, []);

  const categories = ['All', 'Quilts', 'Throws', 'Cushions', 'Bags'];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const checkoutViaWhatsApp = () => {
    if (cart.length === 0) return;
    const itemList = cart.map(i => `• ${i.name} (x${i.quantity}) - ₹${i.price * i.quantity}`).join('%0A');
    const msg = `Hello Gudris! 🌿%0AI would like to order the following:%0A%0A${itemList}%0A%0A*Total Amount: ₹${totalAmount}*%0A%0APlease share payment details and estimated delivery time!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  const buyDirectWhatsApp = (product: Product) => {
    const msg = `Hi Gudris! 🌿 I love the "${product.name}" (₹${product.price}) on gudris.com. Is this piece currently available for order?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. Sticky Notification Bar */}
      <div className="bg-stone-950 text-stone-200 text-xs py-2 px-4 text-center tracking-widest uppercase flex items-center justify-center gap-3">
        <Sparkles size={13} className="text-amber-400" />
        <span>Festive Offer: Free Express Shipping Across India on all orders</span>
        <Sparkles size={13} className="text-amber-400" />
      </div>

      {/* 2. Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="text-3xl font-serif tracking-wider font-semibold uppercase text-stone-900">
              Gudris<span className="text-amber-700">.</span>
            </a>
            <nav className="hidden md:flex space-x-6 text-xs uppercase tracking-widest font-medium text-stone-600">
              <a href="#shop" className="hover:text-amber-800 transition">Collection</a>
              <a href="#story" className="hover:text-amber-800 transition">Our Heritage</a>
              <a href="#reviews" className="hover:text-amber-800 transition">Testimonials</a>
            </nav>
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 px-5 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition shadow-sm"
          >
            <ShoppingBag size={15} />
            <span>Bag</span>
            <span className="bg-amber-700 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          </button>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="relative px-6 pt-16 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100/70 text-amber-900 text-xs font-medium px-3.5 py-1.5 rounded-full mb-6">
              <Sparkles size={14} className="text-amber-700" />
              100% Handcrafted • Zero-Waste Upcycling
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif text-stone-900 leading-[1.15] tracking-tight">
              Every stitch carries a legacy of warmth & craft.
            </h1>
            <p className="mt-6 text-stone-600 text-base sm:text-lg leading-relaxed max-w-lg">
              Authentic handmade Gudri textiles lovingly quilted by skilled rural women artisans. Each piece is unique, breathing sustainable soul into your modern home.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a 
                href="#shop" 
                className="inline-flex items-center gap-3 bg-stone-900 hover:bg-amber-900 text-white px-8 py-3.5 rounded-full text-xs uppercase font-medium tracking-widest transition shadow"
              >
                Explore Collection <ArrowRight size={15} />
              </a>
              <a 
                href="#story" 
                className="inline-flex items-center gap-2 border border-stone-300 hover:border-stone-900 text-stone-700 px-6 py-3.5 rounded-full text-xs uppercase font-medium tracking-widest transition"
              >
                Our Story
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80" 
                alt="Handmade Gudri Quilt" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-xl shadow-xl max-w-xs border border-stone-100 hidden sm:block">
              <div className="flex text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-xs font-serif italic text-stone-800">"The texture and running stitches are pure art. Feels like a hug from heritage."</p>
              <p className="text-[10px] text-stone-500 mt-2 font-medium tracking-wider uppercase">— Ananya M., Bangalore</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trust Badges */}
      <section className="border-y border-stone-200/80 bg-white/60 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="text-amber-800 mb-2" size={26} />
            <span className="text-xs uppercase font-semibold tracking-wider">Authentic Hand-Stitched</span>
            <span className="text-[11px] text-stone-500 mt-0.5">True running Kantha art</span>
          </div>
          <div className="flex flex-col items-center">
            <Sparkles className="text-amber-800 mb-2" size={26} />
            <span className="text-xs uppercase font-semibold tracking-wider">Zero-Waste Cotton</span>
            <span className="text-[11px] text-stone-500 mt-0.5">100% sustainable repurposed textiles</span>
          </div>
          <div className="flex flex-col items-center">
            <Truck className="text-amber-800 mb-2" size={26} />
            <span className="text-xs uppercase font-semibold tracking-wider">Free Shipping</span>
            <span className="text-[11px] text-stone-500 mt-0.5">Dispatched within 24 hours</span>
          </div>
          <div className="flex flex-col items-center">
            <RotateCcw className="text-amber-800 mb-2" size={26} />
            <span className="text-xs uppercase font-semibold tracking-wider">Fair Artisan Wages</span>
            <span className="text-[11px] text-stone-500 mt-0.5">Empowering rural women</span>
          </div>
        </div>
      </section>

      {/* 5. Product Collection */}
      <section id="shop" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-amber-800 tracking-widest text-xs uppercase font-bold">Curated Catalog</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-1">One-Of-A-Kind Creations</h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition ${
                  selectedCategory === cat 
                    ? 'bg-stone-900 text-white' 
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white rounded-xl border border-stone-200/70 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/5] bg-stone-100 overflow-hidden relative">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-stone-900 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded">
                    {item.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-medium text-stone-900 leading-snug">{item.name}</h3>
                  <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-stone-100 flex flex-col gap-3">
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-bold font-serif text-stone-900">₹{item.price}</span>
                  <button
                    onClick={() => buyDirectWhatsApp(item)}
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-medium"
                  >
                    <MessageCircle size={15} /> WhatsApp Ask
                  </button>
                </div>
                <button 
                  onClick={() => addToCart(item)}
                  className="w-full bg-stone-900 hover:bg-amber-800 text-white py-2.5 rounded-lg text-xs uppercase tracking-wider font-medium transition"
                >
                  Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Artisan Story Section */}
      <section id="story" className="bg-[#F3EEEA] py-20 px-6 border-t border-stone-200">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-amber-800 tracking-widest text-xs uppercase font-bold">The Soul Behind Gudri</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-stone-900 mt-3 leading-tight">
            Not manufactured in factories. Stitched with love by hand.
          </h2>
          <p className="mt-6 text-stone-600 leading-relaxed text-base sm:text-lg">
            For generations across rural India, mothers have gathered layers of vintage cotton saris, fastening them with endless running Kantha stitches to keep families warm. We partner directly with artisan women in rural cooperatives, paying 2x ethical living wages so this meditative craft continues to thrive.
          </p>
          <div className="mt-8 flex justify-center gap-8 text-stone-800 font-serif">
            <div>
              <div className="text-3xl font-bold text-stone-900">100%</div>
              <div className="text-xs text-stone-600 font-sans uppercase tracking-wider mt-1">Vintage Cotton</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-stone-900">40+ Hrs</div>
              <div className="text-xs text-stone-600 font-sans uppercase tracking-wider mt-1">Work Per Quilt</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-stone-900">0% Plastic</div>
              <div className="text-xs text-stone-600 font-sans uppercase tracking-wider mt-1">Eco Packaging</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Reviews Section */}
      <section id="reviews" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-amber-800 tracking-widest text-xs uppercase font-bold">Real Stories</span>
          <h2 className="text-3xl font-serif text-stone-900 mt-2">Loved in Modern Homes</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex text-amber-500 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              "The Kantha stitches are so fine and rhythmic. I draped the Gudri quilt over my reading armchair and it transformed the entire room."
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-stone-800">— Shweta R., Mumbai</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex text-amber-500 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              "Ordered the tote bag and a throw. The unboxing had zero plastic and the cotton scent was lovely. Fast delivery too!"
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-stone-800">— Radhika P., Delhi</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex text-amber-500 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              "Knowing this directly supported a rural woman artisan makes it feel so special. This is the future of sustainable Indian design."
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-stone-800">— Priya K., Bangalore</p>
          </div>
        </div>
      </section>

      {/* 8. Slide-Over Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 p-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} />
                  <span className="font-serif text-lg font-semibold uppercase">Your Bag ({totalItems})</span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-stone-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-20 text-stone-400">
                  <ShoppingBag size={48} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Your shopping bag is empty.</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100 max-h-[60vh] overflow-y-auto mt-4 pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4 items-center">
                      <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded object-cover" />
                      <div className="flex-1">
                        <h4 className="text-xs font-serif font-semibold">{item.name}</h4>
                        <span className="text-xs font-bold text-stone-900">₹{item.price}</span>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 border rounded hover:bg-stone-50">
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 border rounded hover:bg-stone-50">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-stone-200 pt-4">
                <div className="flex justify-between items-center text-sm font-semibold mb-4">
                  <span>Subtotal</span>
                  <span className="text-lg font-serif">₹{totalAmount}</span>
                </div>
                <button
                  onClick={checkoutViaWhatsApp}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-lg text-xs uppercase font-medium tracking-wider flex items-center justify-center gap-2 shadow"
                >
                  <MessageCircle size={16} /> Complete Order via WhatsApp
                </button>
                <p className="text-[10px] text-center text-stone-400 mt-2">
                  Orders confirmed directly with our artisan team.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. Footer */}
      <footer className="bg-stone-950 text-stone-400 py-16 px-6 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-serif text-white uppercase tracking-wider font-bold">
              Gudris<span className="text-amber-500">.</span>
            </h3>
            <p className="mt-3 text-stone-400 leading-relaxed text-xs">
              Preserving Indian hand-stitch heritage through upcycled, slow-crafted home and lifestyle goods.
            </p>
          </div>

          <div>
            <h4 className="text-white uppercase font-bold tracking-wider text-xs mb-3">Shop Categories</h4>
            <ul className="space-y-2">
              <li><a href="#shop" className="hover:text-white">Gudri Quilts & Blankets</a></li>
              <li><a href="#shop" className="hover:text-white">Artisanal Sofa Throws</a></li>
              <li><a href="#shop" className="hover:text-white">Hand-Stitched Cushion Sets</a></li>
              <li><a href="#shop" className="hover:text-white">Zero-Waste Tote Bags</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white uppercase font-bold tracking-wider text-xs mb-3">Customer Care</h4>
            <ul className="space-y-2">
              <li>Shipping & Delivery Policy</li>
              <li>Return & Exchange Guide</li>
              <li>Wash & Care Instructions</li>
              <li>Artisan Fair-Trade Guarantee</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white uppercase font-bold tracking-wider text-xs mb-3">Connect With Us</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Inquiries, custom sizes & bulk orders:
            </p>
            <p className="text-stone-200 mt-2 font-medium">ordersgudris@gmail.com</p>
            <p className="text-stone-200">WhatsApp: +91 98765 43210</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-stone-800/80 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} Gudris. All rights reserved. Handcrafted in India.</p>
          <p className="mt-2 sm:mt-0">Sustainable • Ethical • One-of-a-Kind</p>
        </div>
      </footer>
    </div>
  );
}