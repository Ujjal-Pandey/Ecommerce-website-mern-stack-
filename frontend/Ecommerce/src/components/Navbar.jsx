import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart, LogOut, Package, Store, ChevronDown, Menu, X, UserCircle, Settings } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (adminDropdownOpen && !e.target.closest('[data-admin-dropdown]')) {
        setAdminDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [adminDropdownOpen]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3" 
          : "bg-white py-4 border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 md:gap-2 shrink-0 group">
            <div className="w-9 md:w-10 h-9 md:h-10 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
               <Store className="w-5 md:w-6 h-5 md:h-6" />
            </div>
            <span className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">EssentiaMart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link to="/" className="text-sm lg:text-base text-slate-600 font-bold hover:text-primary-600 transition-colors">Home</Link>
            <Link to="/products" className="text-sm lg:text-base text-slate-600 font-bold hover:text-primary-600 transition-colors">Products</Link>
            <Link to="/cart" className="relative text-slate-600 font-bold hover:text-primary-600 transition-colors flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg hover:bg-primary-50">
               <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-red-500 text-white text-xs font-black rounded-full min-w-[22px] h-[22px] flex items-center justify-center shadow-md">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>

          {/* Auth Section - Desktop */}
          <div className="hidden md:flex gap-3 lg:gap-4 items-center">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 lg:gap-3 border-r border-slate-200 pr-3 lg:pr-5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                     <UserCircle className="w-5 h-5 text-slate-500"/>
                  </div>
                  <div className="text-sm hidden lg:block">
                    <p className="text-slate-800 font-bold text-sm tracking-tight truncate max-w-[120px]">{user?.name || user?.email}</p>
                    {isAdmin && <p className="text-xs text-primary-600 font-black uppercase tracking-wider">Admin</p>}
                  </div>
                </div>
                
                <Link to="/orders" className="text-sm text-slate-600 hover:text-primary-600 font-bold transition-colors flex items-center gap-1.5">
                   <Package className="w-4 h-4"/> Orders
                </Link>

                {isAdmin && (
                  <div className="relative group" data-admin-dropdown>
                    <button 
                      className="text-xs lg:text-sm px-2 lg:px-3 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5 lg:gap-2 whitespace-nowrap"
                      onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                    >
                      <Settings className="w-4 h-4"/> <span className="hidden lg:inline">Admin</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${adminDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {adminDropdownOpen && (
                      <div className="absolute top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 overflow-hidden transform opacity-100 -translate-x-12">
                        <Link to="/admin/products" className="block px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-bold transition-colors flex items-center gap-2" onClick={() => setAdminDropdownOpen(false)}>
                          <Package className="w-4 h-4"/> Manage Products
                        </Link>
                        <div className="border-t border-slate-100 my-1"></div>
                        <Link to="/admin/orders" className="block px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-bold transition-colors flex items-center gap-2" onClick={() => setAdminDropdownOpen(false)}>
                          <Store className="w-4 h-4"/> Manage Orders
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1" title="Logout">
                   <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link to="/register" className="text-sm px-5 py-2.5 bg-primary-600 border border-transparent text-white rounded-xl font-bold hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all shadow-md">
                Sign Up
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-colors">
             {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 mt-2 pt-3 space-y-1.5 pb-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <Link to="/" className="block text-slate-700 font-bold hover:text-primary-600 hover:bg-primary-50 p-3 rounded-lg transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" className="block text-slate-700 font-bold hover:text-primary-600 hover:bg-primary-50 p-3 rounded-lg transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Products</Link>
            <Link to="/cart" className="flex items-center justify-between text-slate-700 font-bold hover:text-primary-600 hover:bg-primary-50 p-3 rounded-lg transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>
              <span>Cart</span>
              {getCartCount() > 0 && <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-xs font-black">{getCartCount()}</span>}
            </Link>
            
            <div className="border-t border-slate-100 my-1.5"></div>
            
            {isAuthenticated ? (
              <div className="space-y-1.5">
                <div className="px-3 py-2.5 bg-slate-50 rounded-lg mb-2">
                   <p className="text-slate-800 font-black text-xs">{user?.name || user?.email}</p>
                   {isAdmin && <p className="text-primary-600 font-black text-xs uppercase mt-0.5">Administrator</p>}
                </div>
                <Link to="/orders" className="block text-slate-700 font-bold hover:text-primary-600 hover:bg-primary-50 p-3 rounded-lg transition-colors flex items-center gap-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  <Package className="w-4 h-4"/> My Orders
                </Link>
                {isAdmin && (
                  <div className="mt-2 space-y-1 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <p className="text-xs font-black text-indigo-700 uppercase tracking-widest pl-1 mb-1.5">Admin Tools</p>
                    <Link to="/admin/products" className="block text-slate-700 font-bold hover:text-indigo-700 hover:bg-indigo-100/50 p-2 rounded-lg text-xs transition-colors" onClick={() => setMobileMenuOpen(false)}>Inventory</Link>
                    <Link to="/admin/orders" className="block text-slate-700 font-bold hover:text-indigo-700 hover:bg-indigo-100/50 p-2 rounded-lg text-xs transition-colors" onClick={() => setMobileMenuOpen(false)}>Sales</Link>
                  </div>
                )}
                <button onClick={handleLogout} className="w-full mt-3 text-center text-red-600 bg-red-50 hover:bg-red-100 font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                  <LogOut className="w-4 h-4"/> Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <Link to="/register" className="block text-center py-3 bg-primary-600 border border-transparent text-white rounded-lg font-bold hover:bg-primary-500 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
