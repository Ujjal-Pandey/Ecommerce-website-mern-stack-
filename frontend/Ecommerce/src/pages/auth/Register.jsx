import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Shield, UserCircle, ArrowRight } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', isAdmin: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
       setError('Please fill in all fields'); return;
    }
    if (formData.password.length < 6) {
       setError('Password must be at least 6 characters'); return;
    }

    try {
      setError(''); setLoading(true);
      await register(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { state: { message: 'Account created! Please login.' } });
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
          <div className="px-8 pt-10 pb-6 text-center">
             <div className="w-16 h-16 bg-primary-50 border border-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600 shadow-sm">
                <UserCircle className="w-8 h-8"/>
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Account</h2>
             <p className="text-slate-500 font-medium">Join us for the best deals</p>
          </div>
          
          <div className="px-8 pb-8">
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 font-medium text-sm text-center border border-red-100">{error}</div>}
            {success && <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl mb-6 font-medium text-sm text-center border border-emerald-100">Account created! Redirecting...</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="w-5 h-5 text-slate-400" /></div>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 bg-slate-50 focus:bg-white outline-none font-medium" placeholder="John Doe" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 ml-1">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="w-5 h-5 text-slate-400" /></div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 bg-slate-50 focus:bg-white outline-none font-medium" placeholder="john@example.com" required />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="w-5 h-5 text-slate-400" /></div>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 bg-slate-50 focus:bg-white outline-none font-medium" placeholder="••••••••" required />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-1 grid grid-cols-2 mt-4 border border-slate-100">
                <button type="button" onClick={() => setFormData({ ...formData, isAdmin: false })} className={`py-2 text-sm font-bold rounded-lg transition-all ${!formData.isAdmin ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>Customer</button>
                <button type="button" onClick={() => setFormData({ ...formData, isAdmin: true })} className={`py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${formData.isAdmin ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-200' : 'text-slate-500 hover:text-slate-700'}`}>
                   {formData.isAdmin && <Shield className="w-4 h-4"/>} Admin
                </button>
              </div>
              
              <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-4 px-4 mt-6 rounded-xl text-white font-bold tracking-wide shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50">
                {loading ? 'Creating Account...' : <><ArrowRight className="w-5 h-5" /> Sign Up</>}
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-slate-500">
                Already have an account? <Link to="/login" className="font-bold text-slate-900 hover:text-primary-600 transition-colors">Login here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
