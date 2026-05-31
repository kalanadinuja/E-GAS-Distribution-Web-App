import React from 'react';

const API_BASE_URL = 'http://localhost:3000/api/order';

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (jsonError) {
      errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
    }
    throw new Error(errorData.message || 'Something went wrong');
  }
  
  // Check if response has content
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return { success: true, message: 'Request completed successfully' };
  }
  
  try {
    return await response.json();
  } catch (jsonError) {
    console.error('JSON parsing error:', jsonError);
    return { success: true, message: 'Request completed successfully' };
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrders = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}?${queryParams}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Get single order by ID
export const getOrderById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Get order by order ID
export const getOrderByOrderId = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/order-id/${orderId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const updateOrder = async (id, orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// Get order statistics
export const getOrderStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching order stats:', error);
    throw error;
  }
};

// Get orders by user ID
export const getOrdersByUser = async (userId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    console.log('Fetching orders for user:', userId);
    console.log('API URL:', `${API_BASE_URL}/user/${userId}?${queryParams}`);
    
    const response = await fetch(`${API_BASE_URL}/user/${userId}?${queryParams}`);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    console.log('Response text:', text);
    
    if (!text) {
      return { success: true, orders: [] };
    }
    
    try {
      const data = JSON.parse(text);
      console.log('Parsed data:', data);
      return data;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', text);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const exportOrders = async (params = {}) => {
  try {
    // For reports, fetch all orders without pagination
    const reportParams = {
      ...params,
      page: 1,
      limit: 1000, // Large limit to get all orders
      _t: Date.now() // Force refresh
    };
    
    console.log('Fetching orders for report with params:', reportParams);
    
    // First get the orders data
    const response = await getOrders(reportParams);
    
    if (!response.success) {
      throw new Error('Failed to fetch orders');
    }

    // Check if we have orders to export
    if (!response.orders || response.orders.length === 0) {
      throw new Error('No orders found to export');
    }
    
    console.log(`Exporting ${response.orders.length} orders to PDF`);

    // Import jsPDF dynamically
    const { jsPDF } = await import('jspdf');
    
    // Create new PDF document
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Add title
    doc.setFontSize(20);
    doc.text('E-GAS Order Management Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add table headers
    const headers = ['Order ID', 'Customer', 'Product', 'Quantity', 'Total', 'Status', 'Date'];
    const columnWidths = [35, 40, 35, 20, 25, 25, 30];
    
    let yPosition = 50;
    
    // Add headers
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    let xPosition = 20;
    headers.forEach((header, index) => {
      doc.text(header, xPosition + 2, yPosition); // Add 2mm padding
      xPosition += columnWidths[index];
    });
    
    // Add line under headers
    yPosition += 5;
    doc.line(20, yPosition, 200, yPosition);
    yPosition += 10;
    
    // Add order data
    doc.setFont(undefined, 'normal');
    response.orders.forEach((order, index) => {
      if (yPosition > 280) { // Check if we need a new page
        doc.addPage();
        yPosition = 20;
      }
      
      const rowData = [
        order.orderId || 'N/A',
        order.customerName || 'N/A',
        order.cylinder?.name || 'N/A',
        order.quantity?.toString() || 'N/A',
        `Rs. ${order.totalAmount?.toLocaleString() || '0'}`,
        order.status || 'N/A',
        new Date(order.orderDate).toLocaleDateString()
      ];
      
      xPosition = 20;
      rowData.forEach((data, colIndex) => {
        // Truncate long text based on column
        let text = data;
        if (colIndex === 0 && data.length > 12) { // Order ID
          text = data.substring(0, 12) + '…';
        } else if (colIndex === 1 && data.length > 18) { // Customer Name
          text = data.substring(0, 18) + '…';
        } else if (colIndex === 2 && data.length > 15) { // Product
          text = data.substring(0, 15) + '…';
        } else if (data.length > 15) {
          text = data.substring(0, 15) + '…';
        }
        
        doc.text(text, xPosition + 2, yPosition); // Add 2mm padding
        xPosition += columnWidths[colIndex];
      });
      
      yPosition += 8;
    });
    
    // Add summary
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Orders: ${response.orders.length}`, 20, yPosition);
    
    // Calculate total revenue
    const totalRevenue = response.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    yPosition += 10;
    doc.text(`Total Revenue: Rs. ${totalRevenue.toLocaleString()}`, 20, yPosition);
    
    // Save the PDF using a more reliable method
    const fileName = `orders-report-${new Date().toISOString().split('T')[0]}.pdf`;
    
    try {
      // Generate PDF blob
      const pdfBlob = doc.output('blob');
      
      // Verify the blob was created
      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error('Failed to generate PDF content');
      }
      
      console.log('PDF blob created successfully, size:', pdfBlob.size, 'bytes');
      
      // Create download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(pdfBlob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      console.log('PDF download triggered:', fileName);
      
      // Clean up after a short delay
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      }, 1000);
      
      return { success: true, message: 'Orders exported as PDF successfully!' };
    } catch (saveError) {
      console.error('Error saving PDF:', saveError);
      throw new Error(`Failed to save PDF file: ${saveError.message}`);
    }
  } catch (error) {
    console.error('Error exporting orders:', error);
    
    // Fallback to CSV export if PDF fails
    try {
      console.log('PDF export failed, trying CSV fallback…');
      return await exportOrdersCSV(params);
    } catch (csvError) {
      console.error('CSV export also failed:', csvError);
      throw new Error(`Export failed: ${error.message}`);
    }
  }
};

export const exportOrdersCSV = async (params = {}) => {
  try {
    // For reports, fetch all orders without pagination
    const reportParams = {
      ...params,
      page: 1,
      limit: 1000, // Large limit to get all orders
      _t: Date.now() // Force refresh
    };
    
    console.log('Fetching orders for CSV report with params:', reportParams);
    
    const response = await getOrders(reportParams);
    
    if (!response.success) {
      throw new Error('Failed to fetch orders');
    }

    if (!response.orders || response.orders.length === 0) {
      throw new Error('No orders found to export');
    }
    
    console.log(`Exporting ${response.orders.length} orders to CSV`);

    // Create CSV content
    const headers = ['Order ID', 'Customer Name', 'Email', 'Phone', 'Product', 'Quantity', 'Total Amount', 'Status', 'Order Date'];
    const csvContent = [
      headers.join(','),
      ...response.orders.map(order => [
        order.orderId || 'N/A',
        `"${order.customerName || 'N/A'}"`,
        `"${order.email || 'N/A'}"`,
        `"${order.phone || 'N/A'}"`,
        `"${order.cylinder?.name || 'N/A'}"`,
        order.quantity || 'N/A',
        order.totalAmount || 'N/A',
        order.status || 'N/A',
        new Date(order.orderDate).toLocaleDateString()
      ].join(','))
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const fileName = `orders-report-${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    
    try {
      link.click();
      console.log('CSV download triggered:', fileName);
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      return { success: true, message: 'Orders exported as CSV successfully!' };
    } catch (downloadError) {
      console.error('Error triggering CSV download:', downloadError);
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      throw new Error('Failed to download CSV file');
    }
  } catch (error) {
    console.error('Error exporting orders to CSV:', error);
    throw error;
  }
};

// React component for order service status
export const OrderServiceStatus = ({ status = 'ready' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      case 'success':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'loading':
        return 'Loading';
      case 'error':
        return 'Error';
      case 'success':
        return 'Success';
      default:
        return 'Ready';
    }
  };

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${
        status === 'loading' ? 'bg-blue-600 animate-pulse' :
        status === 'error' ? 'bg-red-600' :
        status === 'success' ? 'bg-green-600' :
        'bg-gray-600'
      }`}></div>
      {getStatusText()}
    </div>
  );
};

export default {
  createOrder,
  getOrders,
  getOrderById,
  getOrderByOrderId,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
  getOrdersByUser,
  exportOrders,
  exportOrdersCSV,
  OrderServiceStatus
};
