import express from 'express';
import {
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
  cleanOrderIds
} from '../controllers/order.controller.js';

const router = express.Router();

router.post('/create', createOrder);

router.get('/', getOrders);

// Get order statistics
router.get('/stats', getOrderStats);

router.get('/export', exportOrders);

// Clean up corrupted order IDs
router.post('/clean-ids', cleanOrderIds);

// Get orders by user ID
router.get('/user/:userId', getOrdersByUser);

// Get single order by MongoDB ID
router.get('/:id', getOrderById);

// Get order by order ID (ORD-xxx format)
router.get('/order-id/:orderId', getOrderByOrderId);

router.put('/:id', updateOrder);

router.patch('/:id/status', updateOrderStatus);

router.delete('/:id', deleteOrder);

export default router;
