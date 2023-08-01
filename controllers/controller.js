const { Product, Order, OrderDetail, Table } = require("../models/index");

const { v4: uuidv4 } = require("uuid");
const midtransClient = require("midtrans-client");
const axios = require("axios");
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
  static async handleOrder(req, res) {
    console.log(uuidv4(), "<<< ini uuid");
    try {
      const { tableId: tableId } = req.params;
      const base_url = "http://localhost:3000";
      const qrCode = await axios.post(
        "https://api.qr-code-generator.com/v1/create?access-token=sJXRC6Kycf-E6flwZ3aRPcJKK8POHp00W5On3TIvACNrqn7F7jLbCcoPppslWm7E",
        {
          frame_name: "no-frame",
          qr_code_text: base_url + "/orders" + `${tableId}`,
          image_format: "SVG",
          qr_code_logo: "scan-me-square",
        }
      );

      console.log(tableId, "<<< ini table id");
      const orderNo = uuidv4();
      console.log(orderNo);
      const order = await Order.create({
        orderNo: orderNo,
        TableId: tableId,
      });

      res.status(200).json({
        id: order.id,
        message: "created",
        qrCode: qrCode.data,
      });
    } catch (err) {
      console.log(err);
    }
  }
  static async handleOrderDetails(req, res) {
    try {
      const { quantity, price } = req.body;
      const { productId: productId } = req.params;
      const order = await Order.findByPk(productId);
      console.log(order.id, "<<< ini order");
      await OrderDetail.create({
        OrderId: order.id,
        ProductId: productId,
        quantity,
        price,
      });
      res.status(200).json({
        message: "created",
      });
    } catch (err) {
      console.log(err);
    }
  }
  static async midtrans(req, res) {
    try {
      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      const { productId: productId } = req.params;
      const order = await Order.findByPk(productId);
      const orderdetail = await OrderDetail.findByPk(order.id);
      console.log(orderdetail.price);
      let parameter = {
        transaction_details: {
          order_id: order.id,
          gross_amount: orderdetail.price,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: "admin",
          //   last_name: "pratama",
          //   email: "admin@example.com",
          //   phone: "08111222333",
        },
      };

      const midtransToken = await snap.createTransaction(parameter);
      //   console.log(midtransToken, "<<<ini midtrans token");
      res.status(201).json({
        midtransToken,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Controller;
