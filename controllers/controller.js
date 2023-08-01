const { Product } = require("../models/index");

class Controller {
  static async listProduct(req, res) {
    try {
      const product = await Product.findAll();

      res.status(200).json({
        data: product,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Controller;
