const Order = require("../models/Order");

class OrderRepository {
  static async createOrder(orderData) {
    const order = new Order(orderData);
    return await order.save();
  }

  static async getOrdersByCustomer(customerId) {
    return await Order.find({ customer: customerId }).populate("wines.wine");
  }

  static async getOrdersByWinery(wineryId) {
    return await Order.find({
      "wines.wine": wineryId,
    }).populate("wines.wine");
  }
}

module.exports = OrderRepository;
