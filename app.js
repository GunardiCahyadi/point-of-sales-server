const express = require("express");
const app = express();
const port = 3000;
const Controller = require("./controllers/controller");
const cors = require("cors");
// const public = require("./public");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
require("dotenv").config();

app.use(express.static("public"));

app.post("/tables", Controller.findTable);
app.get("/products", Controller.listProduct);
app.get("/orderdetails/:orderId", Controller.listOrderDetail);
app.post("/orderdetails", Controller.handleOrderDetails);
app.post("/removecarts", Controller.handleRemoveCart);
app.get("/orders/:orderId", Controller.getOrder);
app.post("/generate-midtrans-token/:orderId", Controller.midtrans);
app.patch("/payments/:orderId", Controller.payment);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
