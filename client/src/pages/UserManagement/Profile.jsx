import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import Footer from '../../components/Footer';
import NavigationBar from '../../components/NavigationBar';
import { Link } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { AUTH_ENDPOINTS } from '../../config/api';
import { getOrdersByUser } from '../../services/orderService';
import profileIcon from '../../assets/profile.png';


export default function Profile() {
  const fileRef = useRef(null);
  const location = useLocation();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // Check if user came from success page and should show order history
  useEffect(() => {
    if (location.state?.showOrderHistory) {
      setShowOrderHistory(true);
      // Fetch orders if not already loaded
      if (orders.length === 0) {
        fetchOrderHistory();
      }
    }
  }, [location.state]);

  const handleFileUpload = (file) => {
    // Reset previous errors
    setFileUploadError(false);
    setFilePerc(0);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setFileUploadError(true);
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setFileUploadError(true);
      return;
    }

    // Simple file handling without Firebase
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData({ ...formData, avatar: e.target.result });
      setFilePerc(100);
      setFileUploadError(false);
    };
    reader.onerror = () => {
      setFileUploadError(true);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    console.log('Current user data:', currentUser);
    
    try {
      dispatch(updateUserStart());
      
      // Prepare update data - include all form fields that have values
      const updateData = {};
      
      // Check each field and include it if it has a value
      if (formData.username && formData.username.trim() !== '') {
        updateData.username = formData.username.trim();
      }
      if (formData.email && formData.email.trim() !== '') {
        updateData.email = formData.email.trim();
      }
      if (formData.phonenumber && formData.phonenumber.trim() !== '') {
        updateData.phonenumber = formData.phonenumber.trim();
      }
      if (formData.address && formData.address.trim() !== '') {
        updateData.address = formData.address.trim();
      }
      if (formData.avatar && formData.avatar.trim() !== '') {
        updateData.avatar = formData.avatar;
      }
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password;
      }
      
      console.log('Sending update data:', updateData);
      
      // If no data to update, just exit edit mode
      if (Object.keys(updateData).length === 0) {
        console.log('No changes to update');
        setIsEditing(false);
        setFormData({});
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
        return;
      }
      
      const res = await fetch(`${AUTH_ENDPOINTS.UPDATE_USER}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await res.json();
      console.log('Update response:', data);
      
      if (data.success === false) {
        dispatch(updateUserFailure(data.message || 'Update failed'));
        return;
      }

      // Update successful
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setIsEditing(false);
      setFormData({});
      
      console.log('Profile updated successfully, returning to view mode');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Update error:', error);
      dispatch(updateUserFailure(error.message || 'Network error occurred'));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${AUTH_ENDPOINTS.DELETE_USER}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(AUTH_ENDPOINTS.SIGNOUT);
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleRemoveProfilePicture = () => {
    setFormData({ ...formData, avatar: '' });
    setFileUploadError(false);
    setFilePerc(0);
  };

  const fetchOrderHistory = async () => {
    if (!currentUser?._id) return;
    
    try {
      setOrdersLoading(true);
      const response = await getOrdersByUser(currentUser._id);
      if (response.success) {
        setOrders(response.orders || []);
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setOrdersLoading(false);
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-purple-100 text-purple-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({
      username: currentUser?.username || currentUser?.name || '',
      email: currentUser?.email || '',
      phonenumber: currentUser?.phonenumber || currentUser?.phone || '',
      address: currentUser?.address || '',
      avatar: currentUser?.avatar || ''
    });
    console.log('Form data initialized:', {
      username: currentUser?.username || currentUser?.name || '',
      email: currentUser?.email || '',
      phonenumber: currentUser?.phonenumber || currentUser?.phone || '',
      address: currentUser?.address || '',
      avatar: currentUser?.avatar || ''
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({});
    setFileUploadError(false);
    setFilePerc(0);
  };

  
  // Debug currentUser data
  console.log('Current user data:', currentUser);
  console.log('User properties:', currentUser ? Object.keys(currentUser) : 'No user data');
  console.log('User success status:', currentUser?.success);
  console.log('User _id:', currentUser?._id);

  return (
    <div className='bg-paleblue'>
      <NavigationBar />
    <div className='p-3 max-w-lg mx-auto' >
    <span onClick={handleSignOut} className='text-white cursor-pointer absolute top-15 right-0 mt-2 mr-4 px-4 py-2 bg-red-700 border border-red-950 rounded-lg flex items-center'>
    <FaSignOutAlt className='mr-2' /> Log Out
    </span>
      <h1 className='text-3xl font-semibold text-center my-7 text-blue'>
        {isEditing ? 'Edit Profile' : 'Profile'}
      </h1>
      
      {!isEditing ? (
        // Profile View Mode
        <div className='flex flex-col gap-6'>
          <div className="relative self-center">
            <img
              src={currentUser.avatar || profileIcon}
              alt='profile'
              className='rounded-full h-32 w-32 object-cover self-center mt-2 border-4 border-blue-200 shadow-lg'
            />
          </div>
          
          <div className='bg-white rounded-lg shadow-md p-6 space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Username</label>
                <p className='text-lg text-gray-900'>
                  {currentUser?.username || currentUser?.name || (currentUser ? 'User data available' : 'Not set')}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                <p className='text-lg text-gray-900'>{currentUser?.email || 'Not set'}</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Phone Number</label>
                <p className='text-lg text-gray-900'>{currentUser?.phonenumber || currentUser?.phone || 'Not set'}</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
                <p className='text-lg text-gray-900'>{currentUser?.address || 'Not set'}</p>
              </div>
            </div>
          </div>
          
          <div className='flex justify-center gap-4'>
            <button
              onClick={handleEditClick}
              style={{ 
                backgroundColor: '#2563eb', 
                color: 'white', 
                border: '2px solid #2563eb',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              Edit Profile
            </button>
            <button
              onClick={handleDeleteUser}
              style={{ 
                backgroundColor: '#b91c1c', 
                color: 'white', 
                border: '2px solid #b91c1c',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      ) : (
        // Edit Mode
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <div className="relative self-center">
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar || profileIcon}
            alt='profile'
            className='rounded-full h-32 w-32 object-cover cursor-pointer self-center mt-2 border-4 border-blue-200 hover:border-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl'
          />
          <div className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          {(formData.avatar || currentUser.avatar) && (
            <button
              onClick={handleRemoveProfilePicture}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              title="Remove profile picture"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <p className='text-sm self-center text-center mt-2'>
          {fileUploadError ? (
            <span className='text-red-700 font-medium'>
              ❌ Error: Image must be less than 2MB and in JPG/PNG format
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-blue-700 font-medium'>
              📤 Uploading… {filePerc}%
            </span>
          ) : filePerc === 100 ? (
            <span className='text-green-700 font-medium'>
              ✅ Image uploaded successfully!
            </span>
          ) : (
            <span className='text-gray-600'>
              Click the camera icon to change your profile picture
            </span>
          )}
        </p>
        <input
          type='text'
          placeholder='username'
          value={formData.username || ''}
          id='username'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='email'
          id='email'
          value={formData.email || ''}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='tel'
          placeholder='phone number'
          pattern='[0-9]{10}'
          value={formData.phonenumber || ''}
          id='phonenumber'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='address'
          value={formData.address || ''}
          id='address'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password (leave blank to keep current)'
          onChange={handleChange}
          id='password'
          className='border p-3 rounded-lg'
        />
          <div className='flex justify-center gap-4 mt-6'>
            <button
              type='button'
              onClick={handleCancelEdit}
              className='bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg border-2 border-red-500'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] border-2 border-orange-500 transform hover:scale-105'
              style={{ backgroundColor: '#ea580c', color: 'white' }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating…
                </div>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
      </form>
      )}

      {/* Order History Section */}
      <div className='mt-8 bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>Order History</h2>
          
          {ordersLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading orders…</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm mt-2">You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.cylinder?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.cylinder?.weight || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rs. {order.totalAmount?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || 'Processing')}`}>
                          {order.status || 'Processing'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(order.deliveryDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      {/* Success and Error Messages */}
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          <strong>Error:</strong> {error}
        </div>
      )}
      {updateSuccess && (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
          <strong>Success:</strong> Profile updated successfully!
        </div>
      )}
      

      
    </div>
    <Footer />
    </div>
  );
}
