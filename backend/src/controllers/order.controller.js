const orderService = require("../services/order.service");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/response.util");

const adminList = asyncHandler(async (req, res) => {
  const orders = await orderService.listOrders();
  ok(res, orders);
});

module.exports = { adminList };
