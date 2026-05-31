import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (location.state?.orderData) {
      setOrderData(location.state.orderData);
    } else {
      // If no order data, redirect to home
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/profile', { state: { showOrderHistory: true } });
  };

  if (!orderData) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavigationBar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">Thank you for your order. We'll process it shortly.</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Details</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{orderData.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">
                    {new Date(orderData.orderDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Date:</span>
                  <span className="font-medium">
                    {new Date(orderData.deliveryDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Processing
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{orderData.customerName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{orderData.phone}</p>
                </div>
                <div>
                  <span className="text-gray-600">Address:</span>
                  <p className="font-medium">{orderData.address}, {orderData.city} {orderData.postalCode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Product Details</h2>
          
          <div className="flex items-center space-x-6">
            <img 
              src={orderData.cylinder.image} 
              alt={orderData.cylinder.name}
              className="w-24 h-32 object-contain"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{orderData.cylinder.name}</h3>
              <p className="text-gray-600 mb-2">{orderData.cylinder.weight}</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-600">Quantity: </span>
                  <span className="font-medium">{orderData.quantity}</span>
                </div>
                <div>
                  <span className="text-gray-600">Unit Price: </span>
                  <span className="font-medium">Rs. {orderData.cylinder.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-6 pt-6">
            <div className="flex justify-between items-center text-2xl font-bold text-gray-900">
              <span>Total Amount:</span>
              <span>Rs. {orderData.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        {orderData.specialInstructions && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Special Instructions</h2>
            <p className="text-gray-700">{orderData.specialInstructions}</p>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">What's Next?</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
              <p className="text-gray-700">Your order has been confirmed and is being processed.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
              <p className="text-gray-700">Our team will prepare your order for delivery.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
              <p className="text-gray-700">You'll receive updates about your delivery status.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">4</div>
              <p className="text-gray-700">Your gas cylinder will be delivered on the scheduled date.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleBackToHome}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Back to Home
          </button>
          <button
            onClick={handleViewOrders}
            className="px-8 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors duration-200"
          >
            View Order History
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
