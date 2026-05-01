import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 md:py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold">EM</div>
              <h3 className="font-black text-lg tracking-tight">EssentiaMart</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your one-stop destination for premium products and exceptional shopping experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="text-slate-400 space-y-2.5 text-sm">
              <li><a href="/" className="hover:text-amber-400 transition-colors duration-200 font-medium">Home</a></li>
              <li><a href="/products" className="hover:text-amber-400 transition-colors duration-200 font-medium">Products</a></li>
              <li><a href="/cart" className="hover:text-amber-400 transition-colors duration-200 font-medium">Cart</a></li>
              <li><a href="/orders" className="hover:text-amber-400 transition-colors duration-200 font-medium">My Orders</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Policies</h4>
            <ul className="text-slate-400 space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200 font-medium">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200 font-medium">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200 font-medium">Refund Policy</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200 font-medium">Shipping Info</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="text-slate-400 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                <span className="font-medium">info@essentiamart.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                <span className="font-medium">+91-98**-****-0</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                <span className="font-medium">Nepal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8 md:pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">&copy; 2026 EssentiaMart. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">Facebook</a>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">Instagram</a>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
