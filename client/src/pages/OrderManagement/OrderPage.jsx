import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
// Robust asset resolution using Vite glob import
const assetMap = import.meta.glob('../../assets/product_*.png', { eager: true, as: 'url' });
const product1 = assetMap['../../assets/product_1.png'];
const product2 = assetMap['../../assets/product_2.png'];
const product3 = assetMap['../../assets/product_3.png'];
const product4 = assetMap['../../assets/product_4.png'];
const product5 = assetMap['../../assets/product_5.png'];
const placeholderImg = (import.meta.glob('../../assets/pro.avif', { eager: true, as: 'url' }))['../../assets/pro.avif'];

export default function OrderPage() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [showSignInPopup, setShowSignInPopup] = useState(false);

  const gasCylinders = [
    {
      id: 1,
      name: "Litro Gas 2.3 kg",
      weight: "2.3 kg",
      price: 694,
      image: product1
    },
    {
      id: 2,
      name: "Litro Gas 5 kg",
      weight: "5 kg",
      price: 1482,
      image: product2
    },
    {
      id: 3,
      name: "Litro Gas 12.5 kg",
      weight: "12.5 kg",
      price: 3690,
      image: product3
    },
    {
      id: 4,
      name: "Laugfs Gas 5 kg",
      weight: "5 kg",
      price: 1645,
      image: product4
    },
    {
      id: 5,
      name: "Laugfs Gas 12.5 kg",
      weight: "12.5 kg",
      price: 4100,
      image: product5
    }
  ];

  const handleBuyClick = (cylinder) => {
    if (currentUser) {
      navigate('/order-form', { state: { selectedCylinder: cylinder } });
    } else {
      setShowSignInPopup(true);
    }
  };

  const handleSignInClick = () => {
    setShowSignInPopup(false);
    navigate('/sign-in');
  };

  const handleSignUpClick = () => {
    setShowSignInPopup(false);
    navigate('/sign-up');
  };

  const handleClosePopup = () => {
    setShowSignInPopup(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavigationBar />
      
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">E-GAS SYSTEM</h1>
          <p className="text-lg text-gray-600">Select items and proceed to place your order</p>
        </div>
      </div>


      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {gasCylinders.map((cylinder) => (
            <div key={cylinder.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 h-full">
              <div className="flex flex-col items-center text-center h-full justify-between">
                {/* Product Image */}
                <div className="mb-4">
                  <img
                    src={cylinder.image}
                    alt={cylinder.name}
                    className="w-32 h-40 object-contain"
                    loading="eager"
                    onError={(e) => {
                      if (e.currentTarget && e.currentTarget.src !== placeholderImg) {
                        e.currentTarget.src = placeholderImg;
                      }
                    }}
                  />
                </div>
                
                {/* Product Details */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{cylinder.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{cylinder.weight}</p>
                <p className="text-2xl font-bold text-blue-600 mb-4">Rs. {cylinder.price.toLocaleString()}</p>
                
                {/* Buy Button */}
                <button
                  onClick={() => handleBuyClick(cylinder)}
                  className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-4 px-6 rounded-lg transition-colors duration-200 cursor-pointer text-lg shadow-lg hover:shadow-xl"
                  type="button"
                  style={{ 
                    minHeight: '50px',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    backgroundColor: '#2563eb'
                  }}
                >
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>Buy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sign In Popup */}
      {showSignInPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
              <p className="text-gray-600 mb-6">
                You need to sign in to place an order. Please sign in or create an account to continue.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleSignInClick}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignUpClick}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </button>
                <button
                  onClick={handleClosePopup}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
