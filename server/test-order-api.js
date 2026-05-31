// Simple test script to verify order API endpoints
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3000/api/order';

const testOrder = {
  customerName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '1234567890',
  address: '123 Main Street',
  city: 'Colombo',
  postalCode: '10000',
  deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  specialInstructions: 'Please call before delivery',
  quantity: 2,
  cylinder: {
    id: 1,
    name: 'Litro Gas 5 kg',
    weight: '5 kg',
    price: 1482,
    image: 'https://via.placeholder.com/150x200/4A90E2/FFFFFF?text=Litro+5kg'
  }
};

async function testOrderAPI() {
  console.log('🧪 Testing Order API...\n');

  try {
    // Test 1: Create Order
    console.log('1. Testing Create Order...');
    const createResponse = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder),
    });
    
    const createResult = await createResponse.json();
    console.log('✅ Create Order:', createResult.success ? 'SUCCESS' : 'FAILED');
    
    if (createResult.success) {
      const orderId = createResult.order._id;
      console.log('   Order ID:', orderId);
      console.log('   Order Number:', createResult.order.orderId);
      
      // Test 2: Get All Orders
      console.log('\n2. Testing Get All Orders...');
      const getResponse = await fetch(`${API_BASE_URL}?page=1&limit=10`);
      const getResult = await getResponse.json();
      console.log('✅ Get Orders:', getResult.success ? 'SUCCESS' : 'FAILED');
      console.log('   Total Orders:', getResult.pagination?.totalOrders || 0);
      
      // Test 3: Get Order by ID
      console.log('\n3. Testing Get Order by ID...');
      const getByIdResponse = await fetch(`${API_BASE_URL}/${orderId}`);
      const getByIdResult = await getByIdResponse.json();
      console.log('✅ Get Order by ID:', getByIdResult.success ? 'SUCCESS' : 'FAILED');
      
      // Test 4: Update Order Status
      console.log('\n4. Testing Update Order Status...');
      const updateStatusResponse = await fetch(`${API_BASE_URL}/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Processing' }),
      });
      const updateStatusResult = await updateStatusResponse.json();
      console.log('✅ Update Status:', updateStatusResult.success ? 'SUCCESS' : 'FAILED');
      
      // Test 5: Get Order Statistics
      console.log('\n5. Testing Get Order Statistics...');
      const statsResponse = await fetch(`${API_BASE_URL}/stats`);
      const statsResult = await statsResponse.json();
      console.log('✅ Get Stats:', statsResult.success ? 'SUCCESS' : 'FAILED');
      console.log('   Total Orders:', statsResult.stats?.totalOrders || 0);
      console.log('   Total Revenue:', statsResult.stats?.totalRevenue || 0);
      
      // Test 6: Delete Order
      console.log('\n6. Testing Delete Order...');
      const deleteResponse = await fetch(`${API_BASE_URL}/${orderId}`, {
        method: 'DELETE',
      });
      const deleteResult = await deleteResponse.json();
      console.log('✅ Delete Order:', deleteResult.success ? 'SUCCESS' : 'FAILED');
      
    }
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testOrderAPI();
