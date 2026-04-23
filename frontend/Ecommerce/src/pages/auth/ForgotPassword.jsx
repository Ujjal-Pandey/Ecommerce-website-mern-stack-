import React, { useState } from "react";
import { Mail, ArrowRight, KeyRound, AlertCircle, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";  
import API from "../../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      await API.post("auth/forgot-password", { email });
      setSuccess(true);
      setTimeout(() => {
        navigate("/reset", { state: { email } });
      }, 1500);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Error sending OTP" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
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
              <KeyRound className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Forgot Password?</h2>
            <p className="text-gray-600 font-medium">Enter your email to receive a reset code</p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            {errors.general && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 font-medium text-sm flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {errors.general}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl mb-6 font-medium text-sm flex items-center gap-2 border border-emerald-200">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                OTP sent! Redirecting...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute inset-y-0 left-0 w-5 h-5 text-gray-400 pointer-events-none ml-3 my-auto" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 mt-6 rounded-xl text-white font-bold tracking-wide shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" /> Send OTP
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link to="/login" className="text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors">
                ← Back to Login
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
