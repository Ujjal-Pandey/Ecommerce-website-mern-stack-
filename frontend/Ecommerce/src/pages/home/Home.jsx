import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';
import { ArrowRight, ShoppingBag, Zap, CreditCard } from 'lucide-react';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isAllProductsPage = location.pathname === '/products';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products from backend:", err);
        setError("Could not load latest products from the server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const displayedProducts = isAllProductsPage ? products : products.slice(0, 4);

  return (
    <div className="bg-slate-50 min-h-screen">
      {!isAllProductsPage && (
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden bg-slate-900 border-b border-slate-800">
          <div className="absolute inset-0 z-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10"></div>
            <img 
              src="https://img.freepik.com/premium-photo/seamless-shopping-experience-3d-vector-render-online-shopping-bag-easy-product-add-cart-ecommerce-simplified_776674-531482.jpg" 
              alt="Hero Background" 
              className="w-full h-full object-cover opacity-70 animate-pulse-slow object-center" 
              style={{ animationDuration: '8s' }} 
            />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl text-center sm:text-left mx-auto sm:mx-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold mb-8 shadow-2xl">
                 <Zap className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> A New Era of Premium Tech
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight drop-shadow-lg">
                {isAuthenticated ? (
                  <>Welcome Back, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-md">{user?.name?.split(' ')[0] || 'Customer'}!</span></>
                ) : (
                  <>Elevate Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-md">Lifestyle.</span></>
                )}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 font-medium leading-relaxed max-w-lg mx-auto sm:mx-0 drop-shadow-sm">
                Discover our vibrant, curated collection of cutting-edge tech, elegant accessories, and truly unique finds designed for the modern trendsetter.
              </p>
              
              {isAuthenticated ? (
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4">
                  <button 
                    onClick={() => navigate('/products')}
                    className="inline-flex justify-center items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                  >
                    Browse Products <ShoppingBag className="w-5 h-5"/>
                  </button>
                  <button 
                    onClick={() => navigate('/orders')}
                    className="inline-flex justify-center items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                  >
                    View Orders <CreditCard className="w-5 h-5"/>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-5">
                  <button 
                    onClick={() => navigate('/register')}
                    className="inline-flex justify-center items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                  >
                    Start Shopping <ArrowRight className="w-5 h-5"/>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-10 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {isAllProductsPage ? 'All Products' : 'Featured Selection'}
            </h2>
          </div>
          {!isAllProductsPage && products.length > 4 && (
            <div className="hidden sm:block">
              <button 
                onClick={() => navigate('/products')}
                className="text-primary-600 font-bold hover:text-primary-700 flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-lg transition-colors"
              >
                View Catalog <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="py-32 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          </div>
        ) : error && products.length === 0 ? (
           // Only show error if no products are rendered at all
          <div className="py-20 text-center">
             <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Zap className="w-8 h-8" />
             </div>
            <p className="text-slate-800 font-bold text-lg">{error}</p>
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
            <p className="text-slate-500 font-medium text-lg">No products available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
