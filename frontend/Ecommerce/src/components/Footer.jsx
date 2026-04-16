import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">About</h4>
            <p className="text-slate-400">
              EssentiaMart – Your online shopping destination for premium tech and elegant accessories.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Links</h4>
            <ul className="text-slate-400 space-y-2">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/products" className="hover:text-white">Products</a></li>
              <li><a href="/cart" className="hover:text-white">Cart</a></li>
              <li><a href="/orders" className="hover:text-white">Orders</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-slate-400">Email: info@essentiamart.com</p>
            <p className="text-slate-400">Phone: +91-98********0</p>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
          <p>&copy; 2026 EssentiaMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
