const dashboardService = require("../services/dashboard.service");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/response.util");

const summary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSummary();
  ok(res, data);
});

module.exports = { summary };
