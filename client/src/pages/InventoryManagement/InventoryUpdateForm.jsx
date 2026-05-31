import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import SideBar from '../../components/SideBar';

export default function InventoryUpdateForm() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [inventorydata, setinventorydata] = useState({
        name: '',
        price: '',
        quantity: '',
        supplier: '',
        type: '2kg',
        manuAt: '',
        expirAt: '',
        storageCondition: '',
        status: 'Active'
    });

    useEffect(() => {
        getusingID();
    }, [id]);

    const getusingID = async  ()  =>{

        try {
            const result = await axios.get(`http://localhost:3000/api/inventory/getsingleitem/${id}`)
            const inventory = result.data.inventory;
            
            inventory.manuAt = inventory.manuAt.split('T')[0];
            inventory.expirAt = inventory.expirAt.split('T')[0];
            setinventorydata(inventory);
            console.log(inventory);
        } catch (err) {
            console.log(err);
        }
       
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("Name:", name);
        console.log("Value:", value);
        setinventorydata(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`http://localhost:3000/api/inventory/update/${id}`, inventorydata)
        .then(() => {
            toast.success('Inventory updated successfully!');
            setTimeout(() => {
                navigate('/inventory-management');
            });
        })
        .catch(error => {
            toast.error('Inventory update failed!');
            console.error('Error updating Inventory:', error);
        });
    };

    return (
        <div className='flex'>
            <SideBar />
            <div className='flex-1'>
                <div className=''>
                    <div className='bg-paleblue justify-between flex px-10 py-8'>
                        <h1 className='text-4xl font-bold text-blue'>Update Inventory Item</h1>
                        <div className='flex gap-2'>
                            
                            <div className="flex w-full flex-col gap-0.5">
                                <div className="flex items-center justify-between font-bold">
                                    <h1>Chanindu Maneth IT23716278</h1>
                                </div>
                                <p className='text-xs '>Inventory and Product Manager</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='p-10 bg-paleblue m-10 rounded-3xl max-w-4xl border-2 border-light-blue'>
                <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-10'>
                        <div className='flex flex-col gap-1 flex-1'>
                            <label className='font-semibold text-black'>Name</label>
                            <input type="text" placeholder='Enter Name' id="name" name="name" value={inventorydata.name} onChange={handleChange} className='border-2 border-gray outline-none rounded-md p-2 mb-4' required/>

                            <label className='font-semibold text-black'>Unit Price</label>
                            <input type="Number" placeholder='Enter Unit price' id="price" name="price" value={inventorydata.price} onChange={handleChange} className='border-2 border-gray outline-none rounded-md p-2 mb-4' required/>

                            <label className='font-semibold text-black'>Quantity</label>
                            <input type="Number" placeholder='Enter Quantity' id="quantity" name="quantity" value={inventorydata.quantity} onChange={handleChange} className='border-2 border-gray outline-none rounded-md p-2 mb-4' required/>

                            <label className='font-semibold text-black'>Supplier</label>
                            <input type="text" placeholder='Enter Supplier name' id="supplier" name="supplier" value={inventorydata.supplier} onChange={handleChange} className='border-2 border-gray outline-none rounded-md p-2 mb-4' required/>

                            <label className='font-semibold text-black'>Store Condition</label>
                            <textarea type="textarea" placeholder='Enter Optimal storage conditions' id="description" name="storageCondition" value={inventorydata.storageCondition} onChange={handleChange} className='border-2 border-gray outline-none rounded-md p-2 mb-4 max-h-20 min-h-10' required/>

                        </div>

                        <div className='flex flex-col gap-1 flex-1'>
                            <label className='font-semibold text-black'>Type</label>
                            <select id="type" name="type" value={inventorydata.type} onChange={handleChange} className='border-2 border-gray outline-none rounded-md p-2 mb-4' required>
                                <option value="2kg">2kg</option>
                                <option value="5kg">5kg</option>
                                <option value="12.5kg">12.5kg</option>
                                <option value="37.5kg">37.5kg</option>

                            </select>

                            <label className='font-semibold text-black'>manufactures Date</label>
                            <input type="date" id="manuAt" name="manuAt" value={inventorydata.manuAt} onChange={handleChange} className='border-2 border-gray outline-none rounded-md p-2 mb-4' required/>

                            <label className='font-semibold text-black'>Expiration Date</label>
                            <input type="date" id="expirAt" name="expirAt" value={inventorydata.expirAt} onChange={handleChange} className='border-2 border-gray outline-none rounded-md p-2 mb-4' required/>

                            <div className='flex items-center gap-2'>
                                <label className='font-semibold text-black'>Available</label>
                                <input type="checkbox" name="status" id="active" checked={inventorydata.status === 'Active'} disabled className='w-5'/>
                            </div>

                            <input 
                                type="submit" 
                                value=" Update" 
                                className='bg-light-blue hover:bg-blue text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105'
                                style={{
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                    border: 'none'
                                }}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
