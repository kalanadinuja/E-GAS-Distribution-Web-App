import React, { useState } from 'react';
import { Link,useNavigate} from 'react-router-dom';
import logo from '../assets/logo2.png';
import { Toaster } from 'react-hot-toast';
import { FaRegUser, FaBoxesStacked } from 'react-icons/fa6';
import { FiTruck } from 'react-icons/fi';
import { MdOutlineInventory } from 'react-icons/md';
import { MdExitToApp} from 'react-icons/md';
import { TbDiscount2 } from 'react-icons/tb';
import { LiaFilePrescriptionSolid } from 'react-icons/lia';
import { GrUserWorker } from 'react-icons/gr';
import { BiDollarCircle } from 'react-icons/bi';
import { BsChevronDown } from 'react-icons/bs';
import { RiDashboardFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';
import { AUTH_ENDPOINTS } from '../config/api';

export default function SideBar() {
  const [subMenuOpen, setSubMenuOpen] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
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
      localStorage.removeItem('access_token');
      dispatch(signOutUserSuccess());
      navigate('/');
    }
  };
  

  const Menus = [
    { title: "User Management", icon: <FaRegUser />, path: '/user-management', submenu: true,
      submenuItems: [
        { title: "User Table", path: '/user-management' },
      ],
    },
    { title: "Delivery Management", icon: <FiTruck />, path: '/delivery-management', submenu: true,
      submenuItems: [
        { title: "Create Tasks", path: '/create-task' },
        { title: "Manage Tasks", path: '/taskpage' },
        { title: "Manage Drivers", path: '/driver-management' }
      ],
    },
    { title: "Product Management", icon: <MdOutlineInventory />, path: '/inventory-management', submenu: true,
      submenuItems: [
        { title: "Enter new Item", path: '/create-inventory' },
        { title: "Inventory", path: '/inventory-management' },
        
      ],
    },
    
    
    { title: "Order Management", icon: <LiaFilePrescriptionSolid />, path: "/order-management", submenu: true,
      submenuItems: [
        { title: "Order form"  },
        { title: "Assign page of Employees" },
      ],
    },
        {
      title: "Employee Management",
      icon: <GrUserWorker />,
      path: "/employee-management",
      submenu: true,
      submenuItems: [
        { title: "All Employees", path: "/employee-management" },
        { title: "Add Employee", path: "/create-employee" },
        { title: "Employee Login", path: "/employee-sign-in" },
      ],
    },

    
    
  ];

  const toggleSubMenu = (index) => {
    setSubMenuOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <>
      <Toaster />
      <div className='bg-dark-blue min-h-screen p-5 pt-8 min-w-max'>
          <img src={logo} alt="logo" className="h-28 w-auto" />
        <ul className='pt-10'>
          {Menus.map((menu, index) => (
            <React.Fragment key={index}>
              <li className={`text-white text-sm flex items-center gap-x-6 cursor-pointer p-2 hover:bg-light-white rounded-md ${menu.spacing ? "mt-9" : "mt-2"}`}>
                <span className='text-2xl block float-left'>{menu.icon ? menu.icon : <RiDashboardFill />}</span>
                <Link to={menu.path} className='text-base font-medium flex-1'>{menu.title}</Link>
                {menu.submenu && (
                  <BsChevronDown className={`${subMenuOpen[index] ? 'rotate-180' : ''}`} onClick={() => toggleSubMenu(index)} />
                )}
              </li>
              {menu.submenu && subMenuOpen[index] && (
                <ul>
                  {menu.submenuItems.map((submenuItem, subIndex) => (
                    <li key={subIndex} className="text-paleblue text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5 hover:bg-light-white rounded-md" >
                      <Link to={submenuItem.path} className="flex-1">
                        {submenuItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </React.Fragment>
          ))}
        </ul>
        <div className="exit p-3 pt-20 h-3">
          <button onClick={handleSignOut} className='flex items-center text-white text-sm gap-x-2 p-2 px-2 bg-light-blue hover:bg-red-700 rounded-md w-full'>
            <MdExitToApp className='text-2xl pl-0' />
            Sign out
          </button>

        </div>

      </div>
    </>
  )
}
