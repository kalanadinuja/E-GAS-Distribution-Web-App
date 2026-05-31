import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import SideBar from '../../components/SideBar';

export default function Inventorycreateform() {
  const navigate = useNavigate();

  // states
  const [imageUploadError, setImageUploadError] = useState(null);
  const [files, setFiles] = useState(null);          // explicit null initial
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [value, setValue] = useState({
    name: '',
    price: '',
    quantity: '',
    supplier: '',
    type: '2KG',
    manuAt: '',
    expirAt: '',
    storageCondition: '',
    imageUrl: '',   // single url expected by backend
    status: 'Active'
  });

  // helper: upload a single File object and return URL
  const uploadFile = async (file) => {
    if (!file) throw new Error('No file provided');

    setUploading(true);
    setImageUploadError(null);

    try {
      const storage = getStorage(app);
      const fileName = Date.now() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // return a promise that resolves with downloadURL
      return await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (err) => {
            console.error('Firebase upload error', err);
            reject(err);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (err) {
              reject(err);
            }
          }
        );
      });
    } finally {
      setUploading(false);
    }
  };

  // called automatically when user selects file
  const handleFileChange = async (e) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    setFiles(selected);
    setImageUploadError(null);

    // auto upload the first file
    const file = selected[0];

    try {
      setUploading(true);
      const url = await uploadFile(file);
      setValue(prev => ({ ...prev, imageUrl: url }));
      setImageUploadError(null);
      toast.success('Image uploaded');
    } catch (err) {
      console.error('Image upload failed', err);
      setImageUploadError('Image upload failed. Try again.');
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // optional: keep a button to manually re-upload if needed
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      setImageUploadError('Please select a file first');
      return;
    }
    try {
      setUploading(true);
      const url = await uploadFile(files[0]);
      setValue(prev => ({ ...prev, imageUrl: url }));
      setImageUploadError(null);
      toast.success('Image uploaded');
    } catch (err) {
      console.error(err);
      setImageUploadError('Image upload failed');
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (name === 'price' || name === 'quantity') {
      const numericValue = parseFloat(value);
      if (numericValue < 0 || isNaN(numericValue)) {
        setError('Please enter a valid non-negative value.');
        parsedValue = '';
      } else {
        setError('');
      }
    } else if (name === 'status') {
      parsedValue = 'Active';
    }

    setValue(prevState => ({ ...prevState, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submit while upload in progress
    if (uploading) {
      toast.error('Please wait until image upload finishes');
      return;
    }

    // Must have an imageUrl because backend requires it
    if (!value.imageUrl) {
      toast.error('Please upload an image before submitting');
      return;
    }

    // Convert numeric fields to number types (optional but safer)
    const payload = {
      ...value,
      price: Number(value.price),
      quantity: Number(value.quantity)
    };

    try {
      const addInventory = await axios.post('http://localhost:3000/api/inventory/create', payload);
      const response = addInventory.data;
      if (response.success) {
        toast.success(response.message, { duration: 2000 });
        setTimeout(() => {
          navigate('/inventory-management');
        }, 1000);
      } else {
        toast.error(response.message || 'Failed to add item');
      }
      console.log(response);
    } catch (error) {
      // log helpful backend error
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to add item');
    }
    console.log(value);
  };

  return (
    <div className='flex'>
      <SideBar />
      <div className='flex-1'>
        <div className='bg-paleblue justify-between flex px-10 py-8'>
          <h1 className='text-4xl font-bold text-blue'>Add new Inventory Item</h1>
          <div className='flex gap-2'>
            <div className="flex w-full flex-col gap-0.5">
              <div className="flex items-center justify-between font-bold">
                <h1>Chanindu Maneth IT23716278</h1>
              </div>
              <p className='text-xs '>Inventory And Product Manager</p>
            </div>
          </div>
        </div>

        <div className="p-10 bg-paleblue m-10 rounded-3xl max-w-7xl border-2 border-light-blue shadow-lg">
          <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-40'>
            <div className='flex flex-col gap-1 flex-1'>
              <label className='font-semibold text-black'>Name</label>
              <input type="text" placeholder='Enter Name' id="name" name="name" value={value.name} onChange={handleChange} className='border-2 border-gray outline-none rounded-md p-2 mb-4 shadow-sm' required />

              <label className='font-semibold text-black'>Unit Price(Rs.)</label>
              <input type="number" placeholder='Enter Unit price' id="price" name="price" value={value.price} onChange={handleChange} className='border-2 border-gray outline-none rounded-md p-2 mb-4 shadow-sm' required />
              {error && <span className="text-red-500">{error}</span>}

              <label className='font-semibold text-black'>Quantity</label>
              <input type="number" placeholder='Enter Quantity' id="quantity" name="quantity" value={value.quantity} onChange={handleChange} className='border-2 border-gray outline-none rounded-md p-2 mb-4 shadow-sm' required />
              {error && <span className="text-red-500">{error}</span>}

              <label className='font-semibold text-black'>Supplier</label>
              <input type="text" placeholder='Enter Supplier name' id="supplier" name="supplier" value={value.supplier} onChange={handleChange} className='border-2 border-gray outline-none rounded-md p-2 mb-4 shadow-sm' required />

              <label className='font-semibold text-black'>Store Condition</label>
              <textarea placeholder='Enter Optimal storage conditions' id="description" name="storageCondition" value={value.storageCondition} onChange={handleChange} className='border-2 border-gray outline-none rounded-md p-2 mb-4 max-h-20 min-h-10 shadow-sm' required />

              <div className="flex gap-10">
                <div className="flex-col">
                  <label className='font-semibold text-black'>Manufactures Date</label>
                  <input type="date" id="manuAt" name="manuAt" value={value.manuAt} onChange={handleChange} className='border-2 border-gray outline-none rounded-md p-2 mb-4 w-full shadow-sm' required />
                </div>

                <div>
                  <label className='font-semibold text-black'>Expire Date</label>
                  <input type="date" id="expirAt" name="expirAt" value={value.expirAt} onChange={handleChange} className='border-2 border-gray outline-none rounded-md p-2 mb-4 w-full shadow-sm' required />
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-1 flex-1'>
              <label className='font-semibold text-black'>Type</label>
              <select id="type" name="type" value={value.type} onChange={handleChange} className='border-2 border-gray outline-none rounded-md p-2 mb-4 shadow-sm' required>
                <option value="2kg">2kg</option>
                <option value="5kg">5kg</option>
                <option value="12.5kg">12.5kg</option>
                <option value="37.5kg">37.5kg</option>
              </select>

              <label className='font-semibold text-black' htmlFor='Enter image'>Enter image</label>

              <div className='flex flex-row items-center gap-10'>
                {/* file input: auto uploads on change */}
                <input
                  onChange={handleFileChange}
                  className='p-3 border border-gray-300 rounded w-3/4'
                  type='file'
                  id='imageUrl'
                  accept='image/*'
                />

                {/* optional manual upload - still works */}
                <button onClick={handleImageSubmit} type='button' disabled={uploading || !files} className='border w-1/3 border-green-700 bg-light-blue text-white rounded uppercase hover:shadow-lg disabled:opacity-80 h-12'>
                  {uploading ? 'Uploading…' : 'Upload'}
                </button>
              </div>

              {/* show upload error or success */}
              {imageUploadError && <p className='text-red-700 mt-2'>{imageUploadError}</p>}
              {value.imageUrl && !imageUploadError && <p className='text-green-600 mt-2'>Image uploaded</p>}

              <div className='p-2 flex items-center gap-2'>
                <label className='font-semibold text-black'>Available</label>
                <input type="checkbox" name="status" id="active" checked={value.status === 'Active'} disabled hidden className='w-5 shadow-sm' />
              </div>

              <input
                type="submit"
                value={uploading ? 'Please wait…' : 'Submit'}
                className='bg-light-blue hover:bg-blue text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-60'
                style={{
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
                disabled={uploading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
