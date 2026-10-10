const categoryService = require("../services/category.service");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/response.util");

const list = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories();
  ok(res, categories);
});

module.exports = { list };
