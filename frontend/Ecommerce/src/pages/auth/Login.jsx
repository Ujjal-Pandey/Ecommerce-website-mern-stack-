import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Validation helper
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const user = await login(formData);
      
      if (user?.isAdmin) {
        navigate('/');
      } else {
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err.message || 'Invalid email or password';
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
              <UserCheck className="w-8 h-8 text-amber-600"/>
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome Back</h2>
            <p className="text-gray-600 font-medium">Sign in to your Stride account</p>
          </div>
          
          <div className="px-8 pb-8">
            {/* Success Message */}
            {successMessage && (
              <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-6 font-medium text-sm flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                {successMessage}
              </div>
            )}

            {/* Error Messages */}
            {errors.general && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 font-medium text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {errors.general}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 ml-1">Password</label>
                  <Link
                    to="/forgot"
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 mt-6 rounded-xl text-white font-bold tracking-wide shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" /> Sign In
                  </>
                )}
              </button>
            </form>

            {/* Signup Link */}
            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-amber-600 hover:text-amber-700 transition-colors">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


