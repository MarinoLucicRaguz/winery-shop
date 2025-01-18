const OrderRepository = require("../repositories/orderRepository");
const WineRepository = require("../repositories/wineRepository");

class OrderController {
  static async createOrder(req, res) {
    const { wines } = req.body;
    const customerId = req.user.id;

    try {
      let totalAmount = 0;

      for (let item of wines) {
        const wine = await WineRepository.getWineById(item.wine);
        if (!wine) {
          return res
            .status(404)
            .json({ message: `Wine with ID ${item.wine} not found` });
        }

        totalAmount += wine.price * item.quantity;
      }

      const newOrder = await OrderRepository.createOrder({
        customer: customerId,
        wines,
        totalAmount,
      });

      res.status(201).json(newOrder);
    } catch (err) {
      console.error("Error creating order:", err);
      res.status(500).json({ message: "Failed to create order" });
    }
  }

  static async getCustomerOrders(req, res) {
    const customerId = req.user.id;

    try {
      const orders = await OrderRepository.getOrdersByCustomer(customerId);
      res.status(200).json(orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  }

  static async getWineryOrders(req, res) {
    const wineryId = req.params.wineryId;

    try {
      const orders = await OrderRepository.getOrdersByWinery(wineryId);
      res.status(200).json(orders);
    } catch (err) {
      console.error("Error fetching winery orders:", err);
      res.status(500).json({ message: "Failed to fetch winery orders" });
    }
  }
}

module.exports = OrderController;
