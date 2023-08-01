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

app.get("/products", Controller.listProduct);

app.post("/orders/:tableId", Controller.handleOrder); //

app.post("/orderdetails/:productId", Controller.handleOrderDetails);

app.post("/generate-midtrans-token/:productId", Controller.midtrans);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
