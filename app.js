const express = require("express");
const app = express();
const port = 3000;
const Controller = require("./controllers/controller");
const cors = require("cors");
// const public = require("./public");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static("public"));

app.get("/products", Controller.listProduct);
// app.post("/tables", Controller.addTable);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
