import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import { createOrder } from '../../services/orderService';

export default function OrderForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCylinder = location.state?.selectedCylinder;
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    quantity: 1
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!selectedCylinder) {
      navigate('/order');
    }
  }, [selectedCylinder, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Form submitted with data:', formData);
    console.log('Selected cylinder:', selectedCylinder);
    
    // Simple validation
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!formData.phone.trim()) {
      alert('Please enter your phone number');
      return;
    }
    if (!formData.address.trim()) {
      alert('Please enter your address');
      return;
    }
    
    console.log('Form validation passed, creating order…');
    
    // Create order data
    const orderData = {
      customerName: formData.name,
      phone: formData.phone,
      address: formData.address,
      quantity: formData.quantity,
      cylinder: selectedCylinder,
      email: currentUser?.email || 'customer@example.com',
      city: 'Colombo',
      postalCode: '10000',
      deliveryDate: new Date().toISOString(),
      specialInstructions: '',
      userId: currentUser?._id || null,
    };
    
    // Try to save to MongoDB first
    try {
      console.log('Saving order to MongoDB…');
      const response = await createOrder(orderData);
      console.log('Order saved to MongoDB:', response);
      
      if (response.success) {
        // Navigate to success page with saved order data
        navigate('/order-success', { state: { orderData: response.order } });
      } else {
        throw new Error('Failed to save order to database');
      }
    } catch (apiError) {
      console.error('MongoDB save failed:', apiError);
      
      // Show error message to user
      alert(`Failed to save order to database: ${apiError.message}. Please make sure the server is running and try again.`);
      
     
      return;
    }
  };

  const handleBack = () => {
    navigate('/order');
  };

  if (!selectedCylinder) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavigationBar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
          <p className="text-gray-600">Please fill in your information to complete the order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={selectedCylinder.image} 
                    alt={selectedCylinder.name}
                    className="w-16 h-20 object-contain"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedCylinder.name}</h3>
                    <p className="text-sm text-gray-600">{selectedCylinder.weight}</p>
                    <p className="text-lg font-semibold text-blue-600">Rs. {selectedCylinder.price.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Quantity:</span>
                    <span>{formData.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Unit Price:</span>
                    <span>Rs. {selectedCylinder.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Delivery:</span>
                    <span>Today</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>Rs. {(selectedCylinder.price * formData.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
              
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your  name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your complete address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.quantity ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Back to Products
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors duration-200 text-lg shadow-lg hover:shadow-xl"
                  style={{ 
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}
                >
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>✓ Confirm Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
