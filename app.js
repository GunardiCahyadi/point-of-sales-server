const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const Controller = require("./controllers/controller");
const cors = require("cors");
// const public = require("./public");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static("public"));

app.post("/tables", Controller.findTable);
app.get("/products", Controller.listProduct);
app.get("/orderdetails/:orderId", Controller.listOrderDetail);
app.post("/orderdetails", Controller.handleOrderDetails);
app.post("/removecarts", Controller.handleRemoveCart);
app.get("/orders/:orderId", Controller.getOrder);
app.post("/generate-midtrans-token/:orderId", Controller.midtrans);
app.patch("/payments/:orderId", Controller.payment);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
