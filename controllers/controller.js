const { Product, Order, OrderDetail, Table } = require("../models/index");
const generateOrderId = require("../helper/helper");

// const { v4: uuidv4 } = require("uuid");
const midtransClient = require("midtrans-client");
const axios = require("axios");

// console.log(generateOrderId(), "<<<<<<ini generate order id");

class Controller {
  static async findTable(req, res) {
    try {
      const { tableNo } = req.body;

      const table = await Table.findOne({
        where: {
          tableNo,
        },
      });
      if (!table) {
        throw { name: "error" };
      } else {
        const order = await Order.create({
          orderNo: generateOrderId(),
          TableId: table.id,
        });
        res.status(200).json({
          message: "table",
          tableId: table.id,
          orderId: order.id,
        });
      }
    } catch (err) {
      // console.log(err);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
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
  static async listOrder(req, res) {
    try {
      const { orderId } = req.params;
      const orderdetail = await OrderDetail.findAll({
        where: {
          OrderId: orderId,
        },
        include: ["Product"],
      });

      res.status(200).json({
        data: orderdetail,
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

      // qrcode pas mau bayar
      // const qrCode = await axios.post(
      //   "https://api.qr-code-generator.com/v1/create?access-token=sJXRC6Kycf-E6flwZ3aRPcJKK8POHp00W5On3TIvACNrqn7F7jLbCcoPppslWm7E",
      //   {
      //     frame_name: "no-frame",
      //     qr_code_text: base_url + "/orders" + `${tableId}`,
      //     image_format: "SVG",
      //     qr_code_logo: "scan-me-square",
      //   }
      // );

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
        // qrCode: qrCode.data,
      });
    } catch (err) {
      console.log(err);
    }
  }
  static async handleOrderDetails(req, res) {
    try {
      const { productId, orderId, tableId } = req.body;

      console.log(req.body, "><<<< ini req body");
      const product = await Product.findOne({
        where: {
          id: productId,
        },
      });

      if (!product) {
        throw { name: "Undefined" };
      }

      const order = await Order.findOne({
        where: {
          id: orderId,
          TableId: tableId,
        },
      });

      const detail = await OrderDetail.findOne({
        where: {
          OrderId: order.id,
          ProductId: productId,
        },
      });

      if (!detail) {
        await OrderDetail.create({
          OrderId: order.id,
          ProductId: productId,
          quantity: 1,
          price: product.price,
        });
      } else {
        await OrderDetail.update(
          {
            quantity: detail.quantity + 1,
          },
          {
            where: {
              id: detail.id,
            },
          }
        );
      }

      res.status(200).json({
        message: "created",
        Order: order,
      });

      // const { quantity, price } = req.body; // productid disini
      // const { productId: productId } = req.params; // order id
      // const order = await Order.findByPk(productId);
      // console.log(order.id, "<<< ini order");
      // await OrderDetail.create({
      //   OrderId: order.id,
      //   ProductId: productId,
      //   quantity,
      //   price,
      // });
      // res.status(200).json({
      //   message: "created",
      // });
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

      const { productId: productId } = req.params; // harusnya order id
      const order = await Order.findByPk(productId);
      const orderdetail = await OrderDetail.findByPk(order.id); // harus findAll
      console.log(orderdetail.price);
      let parameter = {
        transaction_details: {
          order_id: order.id,
          gross_amount: orderdetail.price, // price nya calculate dari price *  quantity
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

      const midtransToken = await snap.createTransaction(parameter); // token ini disimpan ke database
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

/**

- find list order detail by orderId (dari localstorage) => harus dibuat
- kalau ada 2 user pakai websitenya secara bersamaan, gimana caranya kita mengetahui bahwa user tersebut order yang mana ??
  => jika hanya pakai orderId, lalu gimana caranya website tersebut mengetahui order yang mana ??
  => masukin ke localstorage orderIdnya, berarti saat midtrans sudah success, harus hapus localstoragenya
- update order status yang di hit dari midtrans (webhooks). jadi nanti di client kalau sudah success, midtrans akan ngehit webhooks yang kamu buat. 
  => webhooks maksudnya seperti bikin endpoint untuk dihit sama server lain (midtrans). nanti endpoint tersebut akan mengubah status order id berdasarkan transactionId (token dari midtrans)

*/
