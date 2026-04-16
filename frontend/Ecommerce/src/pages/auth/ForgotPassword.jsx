import React, { useState } from "react";
import { Mail, ArrowRight, KeyRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";  
import API from "../../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();  // ✅ initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return setError("Please enter your email");
    }

    try {
      setLoading(true);
      setError("");

      // Call backend to send OTP
      await API.post("auth/forgot-password", { email });

      // ✅ Navigate to Reset Password page with email
      navigate("/reset", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-24 px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary-100/40 blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-md w-full z-10">
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100">
          
          {/* Header */}
          <div className="px-8 pt-12 pb-8 text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600 border border-primary-100">
              <KeyRound className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Forgot Password</h2>
            <p className="text-slate-500">Enter your email to receive OTP</p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 py-3.5 rounded-xl border bg-slate-50 focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-500"
              >
                {loading ? "Sending..." : (
                  <>
                    <ArrowRight className="w-5 h-5" /> Send OTP
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-primary-600 font-bold">
                Back to Login
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
