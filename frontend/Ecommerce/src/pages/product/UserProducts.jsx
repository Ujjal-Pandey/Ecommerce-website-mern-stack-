import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductCard from '../../components/ProductCard';
import { Search, PackageOpen } from 'lucide-react';

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 flex items-center gap-3">
          🛍️ Our Collection
        </h1>
        
        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
             <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 md:py-4 text-sm md:text-base rounded-2xl border-2 border-slate-200 shadow-md hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border-2 border-red-200 mb-6 font-medium">
          {error}
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-sm border-2 border-slate-100">
           <PackageOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-600 mb-2">
             No products found
          </p>
          <p className="text-slate-500 text-sm md:text-base">
            {searchTerm ? 'We couldn\'t find anything matching your search.' : 'Our catalog is currently empty.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserProducts;
