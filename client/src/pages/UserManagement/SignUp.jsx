import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../../components/OAuth';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import img01 from '../../assets/Sign-up-2.png';
import { AUTH_ENDPOINTS } from '../../config/api';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phonenumber: '',
    address: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    phonenumber: '',
    address: '',
    password: ''
  });
  
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    phonenumber: false,
    address: false,
    password: false
  });
  
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  // Validation rules
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'username':
        if (!value.trim()) {
          error = 'Username is required';
        } else if (value.length < 3) {
          error = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = 'Username can only contain letters, numbers, and underscores';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'phonenumber':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(value)) {
          error = 'Phone number must be exactly 10 digits';
        }
        break;

      case 'address':
        if (!value.trim()) {
          error = 'Address is required';
        } else if (value.length < 10) {
          error = 'Address must be at least 10 characters';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    // Validate the field in real-time if it's been touched
    if (touched[id]) {
      const error = validateField(id, value);
      setErrors(prev => ({
        ...prev,
        [id]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [id]: true
    }));

    // Validate the field
    const error = validateField(id, value);
    setErrors(prev => ({
      ...prev,
      [id]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    
    // Mark all fields as touched to show all errors
    setTouched({
      username: true,
      email: true,
      phonenumber: true,
      address: true,
      password: true
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    console.log('Signup form submitted with data:', formData);

    // Validate all fields before submission
    if (!validateForm()) {
      setSubmitError('Please fix the errors above');
      return;
    }

    try {
      setLoading(true);
      console.log('Making request to:', AUTH_ENDPOINTS.SIGNUP);
      
      const res = await fetch(AUTH_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Signup response:', data);
      
      if (data.success === false) {
        setLoading(false);
        setSubmitError(data.message);
        return;
      }
      
      setLoading(false);
      setSubmitError(null);
      
      console.log('Signup successful, redirecting to sign-in');
      navigate('/sign-in');
    } catch (error) {
      console.error('Signup error:', error);
      setLoading(false);
      setSubmitError(error.message);
    }
  };

  // Check if form is valid for button styling
  const isFormValid = () => {
    return Object.values(errors).every(error => !error) && 
           Object.values(formData).every(value => value.trim() !== '');
  };

  return (
    <div className='bg-paleblue'>
      <NavigationBar />
      <div className='p-3 w-auto mx-auto'>
        <div className="flex flex-col lg:flex-row max-w-7xl mx-auto justify-between mt-14 mb-14 lg:gap-5">
          <img src={img01} alt="" className="object-cover w-full lg:w-2/3 xl:w-1/2" />
          <div className="flex flex-col justify-center lg:w-1/2">
            <h1 className='text-3xl text-center lg:text-center font-semibold my-7 text-blue '>Sign Up</h1>
            <div className='p-10 bg-paleblue m-10 rounded-3xl max-w-4xl border-2 border-light-blue'>
              <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                {/* Username Field */}
                <div>
                  <input
                    type='text'
                    placeholder='Username'
                    className={`border p-3 rounded-lg w-full ${
                      touched.username && errors.username 
                        ? 'border-red-500 bg-red-50' 
                        : touched.username && !errors.username 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300'
                    }`}
                    id='username'
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.username && errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <input
                    type='email'
                    placeholder='Email'
                    className={`border p-3 rounded-lg w-full ${
                      touched.email && errors.email 
                        ? 'border-red-500 bg-red-50' 
                        : touched.email && !errors.email 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300'
                    }`}
                    id='email'
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.email && errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div>
                  <input
                    type='text'
                    placeholder='Phone Number (10 digits)'
                    className={`border p-3 rounded-lg w-full ${
                      touched.phonenumber && errors.phonenumber 
                        ? 'border-red-500 bg-red-50' 
                        : touched.phonenumber && !errors.phonenumber 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300'
                    }`}
                    id='phonenumber'
                    value={formData.phonenumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.phonenumber && errors.phonenumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phonenumber}</p>
                  )}
                </div>

                {/* Address Field */}
                <div>
                  <input
                    type='text'
                    placeholder='Address'
                    className={`border p-3 rounded-lg w-full ${
                      touched.address && errors.address 
                        ? 'border-red-500 bg-red-50' 
                        : touched.address && !errors.address 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300'
                    }`}
                    id='address'
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.address && errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <input
                    type='password'
                    placeholder='Password'
                    className={`border p-3 rounded-lg w-full ${
                      touched.password && errors.password 
                        ? 'border-red-500 bg-red-50' 
                        : touched.password && !errors.password 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300'
                    }`}
                    id='password'
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.password && errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !isFormValid()}
                  className={`p-3 rounded-lg uppercase ${
                    loading || !isFormValid()
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue text-white hover:opacity-95'
                  }`}
                >
                  {loading ? 'Loading…' : 'Sign Up'}
                </button>
                <OAuth/>
              </form>
            </div>
            <div className='flex gap-2 ml-9 mt-5 mb-8'>
              <p>Have an account?</p>
              <Link to={'/sign-in'}>
                <span className='text-light-blue'>Sign in</span>
              </Link>
            </div>
          </div>
        </div>
        {submitError && <p className='text-red-500 mt-5 text-center'>{submitError}</p>}
      </div>
      <Footer />
    </div>
  );
}