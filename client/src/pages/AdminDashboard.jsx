import { BrowserRouter as Router } from 'react-router-dom';
import SideBar from '../components/SideBar';
import OrderManagement from './OrderManagement/OrderManagement';

export default function AdminDashboard() {
    return (
        <div className='flex'>
            <SideBar />
            <div className='flex-1'>
                <OrderManagement />
            </div>
        </div>
    );
}
