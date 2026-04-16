import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Loader, AlertCircle, Home, Clock } from 'lucide-react';
import paymentService from '../../services/paymentService';
import orderService from '../../services/orderService';
import { useCart } from '../../context/CartContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [redirectCountdown, setRedirectCountdown] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const pidx = searchParams.get('pidx');
  const transaction_id = searchParams.get('transaction_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!pidx) {
        setStatus('failed');
        setMessage('Payment ID not found. Unable to verify payment.');
        return;
      }

      try {
        // Try to get orderId from URL params or sessionStorage
        let orderIdFromParams = searchParams.get('orderId');
        if (!orderIdFromParams) {
          orderIdFromParams = sessionStorage.getItem('lastOrderId');
        }

        console.log('🔍 Payment Verification Started');
        console.log('📦 Order ID:', orderIdFromParams);
        console.log('🔐 Payment Index (PIDX):', pidx);

        const response = await paymentService.verifyPayment(pidx);

        console.log('✅ Payment verification response:', response);

        if (response.data?.payment_status === 'Completed') {
          console.log('💰 Payment COMPLETED - Updating order status...');
          
          // Update order payment status in backend
          if (orderIdFromParams) {
            try {
              console.log(`🚀 Calling updatePaymentStatus with orderId: ${orderIdFromParams}`);
              const updateResponse = await orderService.updatePaymentStatus(orderIdFromParams, 'Completed', pidx);
              console.log('✅ Payment status updated successfully:', updateResponse);
              setOrderId(orderIdFromParams);
              sessionStorage.removeItem('lastOrderId'); // Clear after use
            } catch (err) {
              console.error('❌ Failed to update payment status:', err);
              console.error('Error details:', err.message || err);
            }
          } else {
            console.warn('⚠️ Order ID not found in URL or sessionStorage');
          }

          setStatus('success');
          setMessage('Payment successful! Your order has been confirmed and is now being processed.');
          setPaymentDetails({
            transactionId: response.data?.transaction_id || transaction_id,
            amount: response.data?.amount ? (response.data.amount / 100).toLocaleString('en-IN') : 'N/A',
            timestamp: new Date().toLocaleString('en-IN'),
          });
          clearCart();

          // Auto-redirect after 5 seconds
          setRedirectCountdown(5);
        } else if (response.data?.payment_status === 'Pending') {
          console.log('⏳ Payment PENDING');
          setStatus('pending');
          setMessage('Payment is being processed. Please wait...');
          setPaymentDetails({
            transactionId: transaction_id,
            status: response.data?.payment_status || 'Pending',
          });

          // Auto-redirect pending to orders after 8 seconds
          setRedirectCountdown(8);
        } else if (response.data?.payment_status === 'Failed' || response.data?.payment_status === 'Canceled') {
          console.log('❌ Payment FAILED or CANCELLED');
          setStatus('failed');
          setMessage('Payment was canceled or failed. Please try again.');
          setPaymentDetails({
            transactionId: transaction_id,
            status: response.data?.payment_status,
          });
        } else {
          console.warn('❓ Payment status unknown:', response.data?.payment_status);
          setStatus('pending');
          setMessage('Payment status could not be determined. Please check your orders.');
          setPaymentDetails({
            transactionId: transaction_id,
            status: 'Unknown',
          });
          setRedirectCountdown(5);
        }
      } catch (error) {
        console.error('❌ Payment verification error:', error);
        setStatus('failed');
        setMessage('Could not verify payment. Please check your email for confirmation or contact support.');
      }
    };

    verifyPayment();
  }, [pidx, transaction_id, clearCart, searchParams]);

  // Auto-redirect countdown
  useEffect(() => {
    if (redirectCountdown === null || redirectCountdown <= 0) return;

    const timer = setTimeout(() => {
      setRedirectCountdown(redirectCountdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [redirectCountdown]);

  // Auto-redirect when countdown reaches 0
  useEffect(() => {
    if (redirectCountdown === 0) {
      if (status === 'success' || status === 'pending') {
        navigate('/orders');
      }
    }
  }, [redirectCountdown, status, navigate]);

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="max-w-md w-full">
        {status === 'loading' && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16">
                <Loader className="w-16 h-16 text-purple-600 animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Verifying Payment</h1>
            <p className="text-slate-600 text-sm">Please wait while we confirm your payment with Khalti...</p>
            <div className="mt-6 flex justify-center">
              <div className="animate-pulse text-slate-500 text-xs font-medium">Processing...</div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center transform transition-all">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Success! 🎉</h1>
            <p className="text-lg text-emerald-600 font-semibold mb-6">{message}</p>

            {paymentDetails && (
              <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">{paymentDetails.transactionId?.substring(0, 20)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Amount:</span>
                  <span className="font-bold text-slate-900">Rs. {paymentDetails.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Date & Time:</span>
                  <span className="font-bold text-slate-900 text-xs">{paymentDetails.timestamp}</span>
                </div>
              </div>
            )}

            <p className="text-slate-600 text-xs mb-6 bg-blue-50 p-3 rounded-lg">
              ✓ A confirmation email has been sent to your registered email address.
            </p>

            {redirectCountdown > 0 && (
              <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm font-semibold text-emerald-700 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Redirecting to orders in {redirectCountdown}s...
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => navigate('/orders')}
                className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <CheckCircle2 className="w-5 h-5" />
                View Order Status Now
              </button>
              <Link
                to="/"
                className="w-full px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {status === 'pending' && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16">
                <Loader className="w-16 h-16 text-blue-600 animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Processing Payment</h1>
            <p className="text-slate-600 mb-6 text-sm">Your payment is being processed by Khalti. This may take a few minutes.</p>

            {paymentDetails && (
              <div className="bg-slate-50 rounded-lg p-4 mb-8 text-sm text-left">
                <p className="text-slate-600 mb-2">
                  Transaction ID: <span className="font-mono font-bold break-all text-xs">{paymentDetails.transactionId}</span>
                </p>
                <p className="text-slate-600">
                  Status: <span className="font-bold text-blue-600">{paymentDetails.status}</span>
                </p>
              </div>
            )}

            {redirectCountdown > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-700 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Redirecting to orders in {redirectCountdown}s...
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => navigate('/orders')}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Check Order Status
              </button>
              <Link
                to="/"
                className="w-full px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Failed</h1>
            <p className="text-lg text-red-600 font-semibold mb-6">{message}</p>

            {paymentDetails && (
              <div className="bg-slate-50 rounded-lg p-4 mb-8 text-sm text-left">
                <p className="text-slate-600">
                  Transaction ID: <span className="font-mono font-bold break-all text-xs">{paymentDetails.transactionId}</span>
                </p>
                <p className="text-slate-600 mt-2">
                  Status: <span className="font-bold text-red-600">{paymentDetails.status}</span>
                </p>
              </div>
            )}

            <p className="text-slate-600 text-xs mb-6 bg-red-50 p-3 rounded-lg">
              Please try again or contact support if the issue persists.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Try Payment Again
              </button>
              <Link
                to="/"
                className="w-full px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
