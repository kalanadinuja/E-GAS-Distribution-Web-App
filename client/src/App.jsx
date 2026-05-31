import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import AdminDashboard from './pages/AdminDashboard';
import InventoryUserPage from './pages/InventoryManagement/InventoryUserPageView';
import InventoryCreateForm from './pages/InventoryManagement/InventoryItemCreateForm';
import InventoryUpdateForm from './pages/InventoryManagement/InventoryUpdateForm';
import InventoryManagement from './pages/InventoryManagement/InventoryManagement';
import DriverCreateForm from './pages/DeliveryManagement/DriverCreateForm';
import DriverUpdateForm from './pages/DeliveryManagement/DriverUpdateForm';
import DeliveryTaskcreateForm from './pages/DeliveryManagement/DeliveryTaskcreateForm';
import DeliveryTaskUpdateForm from './pages/DeliveryManagement/DeliveryTaskUpdateForm';
import DeliveryTaskManagement from './pages/DeliveryManagement/DeliveryTaskManagement';
import DeliveryManagement from './pages/DeliveryManagement/DeliveryManagement';
import DriverManagement from './pages/DeliveryManagement/DriverManagement';
import DriverTable from './pages/DeliveryManagement/DriverTable';
import DriverSignIn from './pages/DeliveryManagement/DriverSignIn';
import SignIn from './pages/UserManagement/SignIn';
import SignUp from './pages/UserManagement/SignUp';
import Profile from './pages/UserManagement/Profile';
import UserTable from './pages/UserManagement/Usertable';
import UserManagement from './pages/UserManagement/UserManagement';
import PrivateRoute from './components/PrivateRoute';
import EmployeeManagement from "./pages/EmployeeManagement/EmployeeManagement";
import EmployeeCreateForm from "./pages/EmployeeManagement/EmployeeCreateForm";
import EmployeeUpdateForm from "./pages/EmployeeManagement/EmployeeUpdateForm";
import EmploeeLoginForm from "./pages/EmployeeManagement/EmplyeeLoginForm";
import DriverProfile from './pages/DeliveryManagement/DriverProfile';
import DriverTask from './pages/DeliveryManagement/DriverTask';
import ForgotPassword from './pages/UserManagement/ForgotPassword';
import ResetPassword from './pages/UserManagement/ResetPassword';
import OrderPage from './pages/OrderManagement/OrderPage';
import OrderForm from './pages/OrderManagement/OrderForm';
import OrderSuccess from './pages/OrderManagement/OrderSuccess';
import OrderManagement from './pages/OrderManagement/OrderManagement';

export default function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<PrivateRoute />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Route>
      <Route path="/order" element={<OrderPage />} />
      <Route path="/order-form" element={<OrderForm />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/order-management" element={<OrderManagement />} />
     

      
      

      <Route path="/inventory-management" element={<InventoryManagement/>} />
      <Route path="/create-inventory" element={<InventoryCreateForm/>} />
      <Route path="/update-inventory/:id" element={<InventoryUpdateForm/>} />
      <Route path='/inventory-user' element={<InventoryUserPage/>}/>
        
      <Route path='/delivery-management' element={<DeliveryManagement />} />
      <Route path='/taskpage' element={<DeliveryTaskManagement />} />
      <Route path='/create-task' element={<DeliveryTaskcreateForm />} />
      <Route path='/update-task/:id' element={<DeliveryTaskUpdateForm />} />  
      <Route path='/driver-management' element={<DriverManagement />} />
      <Route path='/driver-create' element={<DriverCreateForm />} />
      <Route path='/driver-update/:id' element={<DriverUpdateForm />} />
      <Route path='/drivers' element={<DriverTable />} />
      <Route path='/driver-signin' element={<DriverSignIn />} />
      <Route path='/driver-profile' element={<DriverProfile />} />
      <Route path='/driver-task' element={<DriverTask />} />

      <Route path="/user-table" element={<UserTable />} />
      <Route path="/user-management" element={<UserManagement />} />
      <Route path='/sign-in' element={<SignIn />} />
      <Route path='/sign-up' element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      
        
      <Route element={<PrivateRoute />}>
        <Route path='/profile' element={<Profile />} />
      </Route>

      <Route path="/employee-management" element={<EmployeeManagement />} />
      <Route path="/create-employee" element={<EmployeeCreateForm />} />
      <Route path="/update-employee/:id" element={<EmployeeUpdateForm />} />
      <Route path='/employee-sign-in' element={<EmploeeLoginForm />} />
    
    </Routes>
  </Router>
  )
}