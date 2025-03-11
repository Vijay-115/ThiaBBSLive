const Order = require('../models/Order.js');
const Variant = require('../models/Variant.js');
const Product = require('../models/Product.js');
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_L6U9arEjNMSbc7',
  key_secret: 'svYmAQ4X695zVnNtbt5kvfIR'
});

exports.createOrder = async (req, res) => {
  console.log("createOrder Request Body:", req.user); // Debugging step
  try {
    const { orderItems, totalAmount, shippingAddress, paymentMethod, payment_details } = req.body;

    console.log("Request Body:", req.body); // Debugging step

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "Order items cannot be empty" });
    }

    const user_id = req.user ? req.user.userId : null;

    console.log("user_id:", user_id);

    // Format order items
    const formattedOrderItems = orderItems.map(item => ({
      product: item?.product || null,
      variant: item?.variant || null,
      quantity: item?.quantity || 1,
      price: item?.price || 0,
    }));

    // Update stock for each order item
    for (const item of formattedOrderItems) {
      if (item.variant) {
        const variant = await Variant.findById(item.variant);
        if (!variant) {
          return res.status(400).json({ success: false, message: "Variant not found" });
        }
        if (variant.stock < item.quantity) {
          return res.status(400).json({ success: false, message: "Insufficient stock for variant" });
        }
        variant.stock -= item.quantity;
        await variant.save();
      } else {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(400).json({ success: false, message: "Product not found" });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ success: false, message: "Insufficient stock for product" });
        }
        product.stock -= item.quantity;
        await product.save();
      }
    }

    const options = {
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    console.log("Creating Razorpay order with options:", options); // Debugging log

    const order = await razorpay.orders.create(options);

    console.log("Razorpay order created successfully:", order); // Debugging log

    // Create new order in DB
    const newOrder = new Order({
      order_id: order.id,
      user_id,
      orderItems: formattedOrderItems,
      total_price: totalAmount,
      shipping_address: shippingAddress,
      status: 'pending',
      payment_method: paymentMethod,
      payment_details,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, message: 'Order created successfully', order: savedOrder });

  } catch (error) {
    console.error("Error creating order:", error); // Full error object

    if (error.statusCode) {
      console.error("Error Status Code:", error.statusCode);
    }
    if (error.error) {
      console.error("Error Code:", error.error.code);
      console.error("Error Description:", error.error.description);
    }

    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: {
        statusCode: error.statusCode || 500,
        code: error.error?.code || "UNKNOWN_ERROR",
        description: error.error?.description || error.message || "Something went wrong"
      }
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const order = await Order.findOne({ order_id: razorpay_order_id });

      if (!order) {
          return res.status(400).json({ success: false, message: "Order not found" });
      }

      const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const generatedSignature = hmac.digest("hex");

      if (generatedSignature === razorpay_signature) {
          order.payment_details.payment_id = razorpay_payment_id;
          order.payment_details.payment_status = "completed";
          await order.save();
          res.json({ success: true, message: "Payment successful" });
      } else {
          res.status(400).json({ success: false, message: "Invalid signature" });
      }
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
}

// Get all orders with user and product details
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user_id", "name email phone") // ✅ Populate user details
      .populate("orderItems.product", "name price image") // ✅ Populate product details
      .populate("orderItems.variant", "name options") // ✅ Populate variant details (if exists)
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
    const order = await Order.findById(req.params.id)
      .populate("user_id", "name email phone")
      .populate("orderItems.product", "name price image")
      .populate("orderItems.variant", "name options");

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
    const orders = await Order.find({ status })
      .populate("user_id", "name email phone")
      .populate("orderItems.product", "name price image")
      .populate("orderItems.variant", "name options");

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
    ).populate("user_id", "name email phone")
      .populate("orderItems.product", "name price image")
      .populate("orderItems.variant", "name options");

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