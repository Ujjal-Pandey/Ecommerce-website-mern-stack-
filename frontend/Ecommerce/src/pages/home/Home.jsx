import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';
import { 
  ArrowRight, ShoppingBag, Zap, Star, Truck, Tag, RotateCw, 
  Heart, User, Laptop, Shirt, Watch, Home as HomeIcon, 
  Package, TrendingUp, Shield, Clock, Award, ChevronRight 
} from 'lucide-react';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const isAllProductsPage = location.pathname === '/products';

  // Slideshow images from public folder
  const slides = [
    '/images/slide-shoes.jpg',
    '/images/slide-laptop.jpg',
    '/images/slide-accessories.jpg',
    '/images/slide-fashion.jpg'
  ];

  // Category sections
  const categories = [
    { id: 1, name: 'Footwear', icon: ShoppingBag, color: 'from-amber-500 to-orange-500', count: 48, image: '/images/category-shoes.jpg' },
    { id: 2, name: 'Electronics', icon: Laptop, color: 'from-blue-500 to-cyan-500', count: 32, image: '/images/category-laptops.jpg' },
    { id: 3, name: 'Fashion', icon: Shirt, color: 'from-purple-500 to-pink-500', count: 56, image: '/images/category-fashion.jpg' },
    { id: 4, name: 'Accessories', icon: Watch, color: 'from-emerald-500 to-teal-500', count: 24, image: '/images/category-accessories.jpg' },
  ];

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over Rs. 5,000' },
    { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions' },
    { icon: RotateCw, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: Clock, title: '24/7 Support', desc: 'Dedicated customer service' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Could not load products from the server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Background slideshow
  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  // Back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayedProducts = isAllProductsPage ? products : products.slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Fixed Background Slideshow */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideIn {
          0% { opacity: 0; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .hero-slide {
          animation: slideIn 1.5s ease-out;
        }
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 30px -12px rgba(0, 0, 0, 0.15);
        }
        .category-card {
          transition: all 0.3s ease;
        }
        .category-card:hover {
          transform: translateY(-8px);
        }
      `}</style>

      {/* Hero Section with Slideshow */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${slide}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold">Biggest Sale of the Year</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Discover Amazing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Products & Deals
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200">
              Shop the latest trends in footwear, electronics, fashion, and accessories. 
              Quality products at unbeatable prices.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => navigate('/products')} 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('categories');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 text-white px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2"
              >
                Explore Categories
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-black">10K+</div>
                <div className="text-sm text-gray-300">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black">500+</div>
                <div className="text-sm text-gray-300">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black">4.8</div>
                <div className="text-sm text-gray-300">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide ? 'w-8 bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Bar */}
      <div className="bg-white shadow-md py-6 sticky top-0 z-20 backdrop-blur-md bg-white/95">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section id="categories" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4">Find exactly what you're looking for</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => navigate('/products')}
                className="group relative overflow-hidden rounded-2xl cursor-pointer category-card"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                     style={{ backgroundImage: `url('${category.image}')` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
                </div>
                <div className="relative p-6 h-64 flex flex-col justify-end text-white">
                  <category.icon className={`w-10 h-10 mb-3 text-transparent bg-clip-text bg-gradient-to-r ${category.color}`} />
                  <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-300">{category.count} Products</p>
                  <button className="mt-4 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-6 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600 mt-2">Hand-picked just for you</p>
            </div>
            <button 
              onClick={() => navigate('/products')}
              className="text-amber-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {isLoading ? (
            <div className="py-32 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-300 border-t-amber-600"></div>
            </div>
          ) : error && products.length === 0 ? (
            <div className="py-20 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-800 font-bold text-lg">{error}</p>
            </div>
          ) : displayedProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-2xl shadow-sm">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-lg">No products available</p>
            </div>
          )}
        </div>
      </section>

      

      {/* Footer */}
     

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-amber-600 hover:bg-amber-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all hover:scale-110 z-40"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
        </button>
      )}
    </div>
  );
};

export default Home;