const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { products, totalAmount, shippingAddress, paymentMethod, payment_details } = req.body;

    console.log("Request Body:", req.body); // Debugging step

    if (!products || Object.keys(products).length === 0) {
      return res.status(400).json({ success: false, message: "Products cannot be empty" });
    }

    const user_id = req.user ? req.user.userId : null;

    // Convert products from object to array
    const formattedProducts = Object.values(products || {}).map(item => ({
      product_id: item?.product?._id || null,
      name: item?.product?.name || "Unknown",
      price: item?.product?.price || 0,
      quantity: item?.quantity || 1,
      seller_id: item?.product?.seller_id || null
    }));

    const newOrder = new Order({
      order_id: `ORD-${Date.now()}`,
      user_id,
      products: formattedProducts,
      total_price: totalAmount,
      shipping_address: shippingAddress,
      status: 'pending',
      payment_method: paymentMethod,
      payment_details,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, message: 'Order created successfully', order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error); // Log the error for debugging
    res.status(500).json({ success: false, message: 'Error creating order', error: error.message });
  }
};

// Get all orders with user information
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user_id", "name email phone") // ✅ Populate user details
      .populate("products.product_id", "name price image") // ✅ Populate product details
      .sort({ created_at: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching orders", 
      error: error.message 
    });
  }
};


// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order', error: error.message });
  }
};

// Get orders by status
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const orders = await Order.find({ status });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
};

// Update order details (including payment details and status)
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, updated_at: Date.now() },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating order', error: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting order', error: error.message });
  }
};
