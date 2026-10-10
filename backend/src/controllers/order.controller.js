const orderService = require("../services/order.service");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/response.util");

const create = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  ok(res, order, 201);
});

const adminList = asyncHandler(async (req, res) => {
  const orders = await orderService.listOrders();
  ok(res, orders);
});

module.exports = { create, adminList };
