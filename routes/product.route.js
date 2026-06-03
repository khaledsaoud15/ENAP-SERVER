const router = require("express").Router();
const { verifyAdmin } = require("../middlewares/token");
const Product = require("../models/product.model");

router.post("/product", verifyAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.status(200).json(newProduct);
});

module.exports = router;
