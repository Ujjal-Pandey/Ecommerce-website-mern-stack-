import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Shield, UserCircle, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', isAdmin: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validation helper functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password && password.length >= 6;
  };

  const validateName = (name) => {
    return name && name.trim().length >= 2 && name.trim().length <= 50;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Full name is required';
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Name must be between 2 and 50 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      await register(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { state: { message: 'Account created successfully! Please login.' } });
      }, 1500);
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      if (errorMessage.includes('email') || errorMessage.includes('Email')) {
        setErrors({ ...errors, email: errorMessage });
      } else {
        setErrors({ ...errors, general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-100">
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center bg-gradient-to-b from-amber-50 to-white">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <UserCircle className="w-8 h-8 text-amber-600"/>
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Create Account</h2>
            <p className="text-gray-600 font-medium">Join Stride for premium footwear</p>
          </div>
          
          <div className="px-8 pb-8">
            {/* Error Messages */}
            {errors.general && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 font-medium text-sm flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {errors.general}
              </div>
            )}
            
            {success && (
              <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl mb-6 font-medium text-sm flex items-center gap-2 border border-emerald-200">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                Account created! Redirecting to login...
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute inset-y-0 left-0 w-5 h-5 text-gray-400 pointer-events-none ml-3 my-auto" />
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all outline-none font-medium ${
                      errors.name 
                        ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-400 focus:border-red-400' 
                        : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200'
                    }`}
                    placeholder="John Doe" 
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1 ml-1">{errors.name}</p>}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute inset-y-0 left-0 w-5 h-5 text-gray-400 pointer-events-none ml-3 my-auto" />
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all outline-none font-medium ${
                      errors.email 
                        ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-400 focus:border-red-400' 
                        : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200'
                    }`}
                    placeholder="john@example.com" 
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-1 ml-1">{errors.email}</p>}
                </div>
              </div>
              
              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute inset-y-0 left-0 w-5 h-5 text-gray-400 pointer-events-none ml-3 my-auto" />
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all outline-none font-medium ${
                      errors.password 
                        ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-400 focus:border-red-400' 
                        : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200'
                    }`}
                    placeholder="••••••••" 
                  />
                  {errors.password && <p className="text-red-600 text-xs mt-1 ml-1">{errors.password}</p>}
                </div>
              </div>

              {/* Admin/Customer Toggle */}
              <div className="bg-gray-50 rounded-xl p-1 grid grid-cols-2 mt-4 border-2 border-gray-200">
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, isAdmin: false })} 
                  className={`py-2 px-3 text-sm font-bold rounded-lg transition-all ${
                    !formData.isAdmin 
                      ? 'bg-white text-gray-900 shadow-sm border-2 border-amber-200' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Customer
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, isAdmin: true })} 
                  className={`py-2 px-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    formData.isAdmin 
                      ? 'bg-amber-50 text-amber-700 shadow-sm border-2 border-amber-200' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {formData.isAdmin && <Shield className="w-4 h-4"/>} Admin
                </button>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full flex justify-center items-center gap-2 py-3 px-4 mt-6 rounded-xl text-white font-bold tracking-wide shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" /> Sign Up
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center text-sm font-medium text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-amber-600 hover:text-amber-700 transition-colors">
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
     