const productService = require("../services/product.service");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/response.util");

const getCatalog = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const products = await productService.getCatalog({ categorySlug: category });
  ok(res, products);
});

const getDetail = asyncHandler(async (req, res) => {
  const product = await productService.getProductDetail(req.params.slug);
  ok(res, product);
});

module.exports = { getCatalog, getDetail };
