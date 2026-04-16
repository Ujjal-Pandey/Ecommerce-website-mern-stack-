import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { XCircle, Home, RefreshCw } from 'lucide-react';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const error = searchParams.get('error') || 'An error occurred during payment processing';
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Failed</h1>
          <p className="text-lg text-red-600 font-semibold mb-6">Unfortunately, your payment could not be processed.</p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-slate-600 mb-2">Error:</p>
            <p className="text-sm font-mono text-red-700">{error}</p>
            {orderId && (
              <p className="text-xs text-slate-500 mt-2">Order ID: {orderId}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-700">
              💡 <strong>Tip:</strong> Check your card details and try again. If the problem persists, contact your bank or our support team.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>

            <Link
              to="/cart"
              className="w-full px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold rounded-lg transition-all duration-200"
            >
              Back to Cart
            </Link>

            <Link
              to="/"
              className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          <p className="text-xs text-slate-500 mt-8">
            Need help? <a href="mailto:support@ecommerce.com" className="text-purple-600 hover:underline font-semibold">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
