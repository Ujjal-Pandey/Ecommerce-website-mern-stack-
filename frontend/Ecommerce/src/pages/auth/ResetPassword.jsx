import React, { useState } from "react";
import { Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";   // ✅ import useNavigate
import API from "../../services/api";

const ResetPassword = () => {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();   // ✅ initialize navigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await API.post("/auth/reset-password", form);

      setSuccess("Password reset successful!");

      // ✅ Navigate to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
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
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Reset Password</h2>
            <p className="text-slate-500">Enter OTP and new password</p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl mb-4 text-center">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-12 py-3.5 rounded-xl border bg-slate-50"
                />
              </div>

              <div className="relative">
                <ShieldCheck className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  name="otp"
                  placeholder="Enter OTP"
                  value={form.otp}
                  onChange={handleChange}
                  className="w-full pl-12 py-3.5 rounded-xl border bg-slate-50"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full pl-12 py-3.5 rounded-xl border bg-slate-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-500"
              >
                {loading ? "Resetting..." : (
                  <>
                    <ArrowRight className="w-5 h-5" /> Reset Password
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

export default ResetPassword;
