const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/response.util");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  ok(res, result);
});

module.exports = { login };
