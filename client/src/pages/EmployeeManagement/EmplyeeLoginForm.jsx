import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../../redux/user/userSlice';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';

export default function EmployeeLogin() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }
    
    console.log('Form submitted with data:', formData);
    
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('http://localhost:3000/api/employee/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      console.log('API Response:', data);
      
      if (data.success === false) {
        console.log('Login failed:', data.message);
        setError(data.message);
        return;
      }
      
      console.log('Login successful, redirecting to admin dashboard…');
      
      // Store token in localStorage for persistence
      if (data.token) {
        localStorage.setItem('access_token', data.token);
      }
      
      // Create the proper payload structure for Redux
      const employeePayload = {
        employee: data.employee,
        token: data.token
      };
      
      dispatch(signInSuccess(employeePayload));
      console.log('Employee login successful, Redux state updated');
      navigate('/admin-dashboard');
    } catch (error) {
      console.log('Login error:', error);
      if (error.message === 'Failed to fetch') {
        setError('Server is not running. Please start the server and try again.');
      } else {
        setError(`Login failed: ${error.message || 'Please check your credentials and try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='bg-paleblue'>
      <NavigationBar />
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 text-blue'>Admin Login</h1>
      <p className='text-center text-gray-600 mb-4'>For employees and administrators only</p>
      <div className='p-10 bg-paleblue m-10 rounded-3xl max-w-4xl border-2 border-light-blue'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Employee ID or Email'
          className='border p-3 rounded-lg'
          id='username'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='NIC Number (Password)'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />

        {error && (
          <div className='text-red-600 text-sm text-center bg-red-100 p-2 rounded'>
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className='bg-blue text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading…' : 'Sign In'}
        </button>   
      </form>
      </div>
      <div className='flex gap-2 mt-5 mb-8 ml-9'>
        <p>Forget password?</p>
          <span className='text-light-blue'>Please! Contact Help Support!</span>
      </div>

    </div>
    <Footer />
    </div>
  );
}
