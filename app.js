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
app.get("/orders/:orderId", Controller.listOrder);
app.post("/orderdetails", Controller.handleOrderDetails);

app.post("/orders/:tableId", Controller.handleOrder); //

app.post("/generate-midtrans-token/:productId", Controller.midtrans);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
