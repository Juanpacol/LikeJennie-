const productService = require("../services/product.service");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/response.util");

const list = asyncHandler(async (req, res) => {
  const products = await productService.listAllProducts();
  ok(res, products);
});

const getOne = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  ok(res, product);
});

const create = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  ok(res, product, 201);
});

const update = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  ok(res, product);
});

const remove = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(204).end();
});

module.exports = { list, getOne, create, update, remove };
