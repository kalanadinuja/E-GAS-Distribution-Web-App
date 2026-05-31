import { FaChevronDown, FaList, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { LuPhoneCall } from "react-icons/lu";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice';
import { AUTH_ENDPOINTS } from '../config/api';

import mainlogo from '../assets/logomain.png';
import profileIcon from '../assets/profile.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function NavigationBar() {
    //user management
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen , setIsOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    const togglePopup = () => {
        setShowPopup(!showPopup);
    }

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    }

    // Close any open overlays/menus on route change
    useEffect(() => {
        setIsOpen(false);
        setShowPopup(false);
        setShowUserMenu(false);
    }, [location.pathname]);

    const handleSignOut = async () => {
        try {
            dispatch(signOutUserStart());
            
            // Clear localStorage
            localStorage.removeItem('access_token');
            
            const res = await fetch(AUTH_ENDPOINTS.SIGNOUT);
            const data = await res.json();
            if (data.success === false) {
                dispatch(signOutUserFailure(data.message));
                return;
            }
            dispatch(signOutUserSuccess());
            navigate('/');
        } catch (error) {
            // Even if API call fails, clear local state
            localStorage.removeItem('access_token');
            dispatch(signOutUserSuccess());
            navigate('/');
        }
    };

  return (
    <div>
        <div className='bg-paleblue'>
            <div className='flex justify-between items-center max-w-7xl mx-auto p-3'>
                <div className='flex justify-normal'>
                    <img src={mainlogo} alt="logo" className="h-16 w-auto" />
                    <form  className='flex items-center text-sm ml-10'>
                        <div className='relative'>
                            <input type='text' placeholder='Search for gas cylinders' className='bg-white border-2 border-light-blue rounded-md placeholder-gray focus:outline-none w-56 p-2 pl-10'/>
                            <FaSearch className='text-gray absolute top-1/2 transform -translate-y-1/2 left-3' />
                        </div>
                        <button type='submit' className="h-10 bg-light-blue border-2 border-light-blue text-white rounded-md px-6 ml-2 hover:bg-blue hover:border-blue transition-all">Search</button>
                    </form>
                </div>
                <button onClick={togglePopup} type='submit' className='bg-light-blue border-2 border-light-blue text-white rounded-md p-2 px-5 flex text-sm ml-2 hover:bg-blue hover:border-blue transition-all'>
                    <LuPhoneCall className='mr-2 text-lg' />
                    Contact Our Delivery Team
                </button>
                {showPopup && (
                        <div className="absolute z-10 mt-2 top-16 right-16 bg-white shadow-lg rounded-md p-2 px-4 text-lg font-semibold transition-all">
                            <p className="text-blue">Phone: 0115656994</p>
                        </div>
                )}
            </div>
        </div>
        <div className='bg-blue'>
            <div className='flex justify-between items-center max-w-7xl mx-auto p-3'>
                <div className="relative inline-block text-left text-white">
                    <button onClick={toggleMenu} className='flex place-items-center'>
                        <FaList className="ml-2 text-4xl"/>
                        <p type="button" className=" w-full rounded-md bg-blue font-medium focus:outline-none" id="options-menu">Home</p>
                        <FaChevronDown className="ml-2 text-2xl"/>
                    </button>
                    {isOpen && (
                        <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-blue" role="menu">
                            <div className="" role="none">
                                <Link to='/' onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm hover:bg-dark-blue border-b-2" role="menuitem">Home</Link>
                                <Link to='/order' onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm hover:bg-dark-blue border-b-2" role="menuitem">Order Gas Cylinders</Link>
                                <Link to='/inventory-user' onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm hover:bg-dark-blue border-b-2" role="menuitem">Catalog</Link>
                                <Link to='/driver-signin' onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm hover:bg-dark-blue border-b-2" role="menuitem">Driver Login</Link>
                                <Link to='/employee-sign-in' onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm hover:bg-dark-blue rounded-md" role="menuitem">Admin Login</Link>
                            </div>
                        </div>
                    )}
                </div>
                <div className='flex'>
                    {currentUser ? (
                        // User is logged in - show profile and logout
                        <div className="relative">
                            <button 
                                onClick={toggleUserMenu}
                                className='bg-white text-dark-blue rounded-md p-2 px-6 flex text-sm ml-2 hover:bg-slate-100 transition-all items-center'
                            >
                                <img src={profileIcon} alt='profile' className='h-5 w-5 mr-2' />
                                {currentUser.username || 'Profile'}
                            </button>
                            {showUserMenu && (
                                <div className="absolute z-10 mt-2 right-0 w-48 bg-white rounded-md shadow-lg border">
                                    <div className="py-1">
                                        <Link 
                                            to="/profile" 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            View Profile
                                        </Link>
                                        <button 
                                            onClick={handleSignOut}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                        >
                                            <FaSignOutAlt className="mr-2" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // User is not logged in - show login and register
                        <>
                            <Link to={'/sign-in'}>
                                <button type='submit' className='bg-white text-dark-blue rounded-md p-2 px-6 flex text-sm ml-2 hover:bg-slate-100 transition-all items-center'>
                                    <img src={profileIcon} alt='profile' className='h-5 w-5 mr-2' />
                                    Login
                                </button>
                            </Link>
                            <Link to={'/sign-up'}>
                                <button type='submit' className='bg-green-600 text-white rounded-md p-2 px-6 flex text-sm ml-6 hover:bg-green-700 transition-all'>Register</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}
