import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../../redux/user/userSlice';
import OAuth from '../../components/OAuth';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import img01 from '../../assets/login-rafiki.png';
import { AUTH_ENDPOINTS } from '../../config/api';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({}); // track field-specific errors
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔹 Real-time validation
  const validateField = (id, value) => {
    let message = "";

    if (id === "email") {
      if (!value) {
        message = "Email is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          message = "Enter a valid email address";
        }
      }
    }

    if (id === "password") {
      if (!value) {
        message = "Password is required";
      } else if (value.length < 4) {
        message = "Password must be at least 4 characters";
      }
    }

    setErrors((prev) => ({ ...prev, [id]: message }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    validateField(id, value); // validate while typing

    // clear backend error once user starts typing again
    if (error) {
      dispatch(signInFailure(null));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form submitted with data:', formData);

    // Only check if fields are not empty
    if (!formData.email || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      dispatch(signInStart());
      console.log('Making request to:', AUTH_ENDPOINTS.SIGNIN);
      
      const res = await fetch(AUTH_ENDPOINTS.SIGNIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Sign-in response:', data);

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        alert(data.message);
        return;
      }

      console.log('Sign-in successful, user data:', data);
      
      // Store token in localStorage for persistence
      if (data.token) {
        localStorage.setItem('access_token', data.token);
      }
      
      dispatch(signInSuccess(data));
      alert('Login successful!');
      navigate('/profile');
    } catch (err) {
      console.error('Sign-in error:', err);
      dispatch(signInFailure(err.message));
      alert('Login failed: ' + err.message);
    } finally {
      // Ensure loading state is reset
      dispatch(signInFailure(null));
    }
  };

  return (
    <div className='bg-paleblue'>
      <NavigationBar />
      <div className='p-3 w-auto mx-auto'>
        <div className="flex flex-col lg:flex-row max-w-7xl mx-auto justify-between mt-10 mb-14 lg:gap-5">
          <img src={img01} alt="" className="object-cover w-full lg:w-2/3 xl:w-1/2" />
          <div className="flex flex-col justify-center lg:w-1/2">
            <h1 className='text-3xl text-center font-semibold my-7 text-blue'>Customer Sign In</h1>
            <div className='p-10 bg-paleblue m-10 rounded-3xl max-w-4xl border-2 border-light-blue'>
              <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

                {/* Email */}
                <input
                  type='email'
                  placeholder='Email'
                  className='border p-3 rounded-lg'
                  id='email'
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                {/* Password */}
                <input
                  type='password'
                  placeholder='Password'
                  className='border p-3 rounded-lg'
                  id='password'
                  onChange={handleChange}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                {/* Forgot Password */}
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-blue hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  disabled={loading}
                  className='bg-blue text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                >
                  {loading ? 'Loading…' : 'Sign In'}
                </button>
                <OAuth />
              </form>
            </div>

            {/* Backend/server error (only once) */}
            {error && <p className='text-red-500 text-center mt-2'>{error}</p>}

            {/* Link to signup */}
            <div className='flex gap-2 ml-9 mb-8 justify-center lg:justify-start'>
              <p>Don’t have an account?</p>
              <Link to={'/sign-up'}>
                <span className='text-light-blue'>Sign up</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
