// Catálogo de errores de la API: cada error lleva un `code` estable (lo que traduce el frontend) y un mensaje
// por defecto en inglés. Los servicios lanzan `new BadRequestError("CART_EMPTY")`, es decir, el código.
const MESSAGES = {
  INTERNAL: "Internal server error",
  ROUTE_NOT_FOUND: "Route not found",
  NOT_FOUND: "Resource not found",
  BAD_REQUEST: "Invalid request",
  VALIDATION_ERROR: "Some of the data sent is not valid",
  UNAUTHORIZED: "Unauthorized",
  INVALID_TOKEN: "Invalid or expired token",
  INVALID_CREDENTIALS: "Invalid credentials",
  TOO_MANY_LOGINS: "Too many failed attempts. Wait a few minutes and try again.",
  TOO_MANY_ORDERS: "Too many orders in a row. Wait a few minutes and try again.",
  TOO_MANY_REQUESTS: "Too many requests. Wait a few minutes and try again.",
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Email is not valid",
  EMAIL_TOO_LONG: "Email is too long",
  PASSWORD_REQUIRED: "Password is required",
  CUSTOMER_NAME_REQUIRED: "Name is required",
  CUSTOMER_NAME_TOO_LONG: "Name is too long",
  QUANTITY_INVALID: "Quantity is not valid",
  QUANTITY_TOO_HIGH: "Too many units of one item",
  CART_INVALID: "Cart is not valid",
  CART_EMPTY: "Cart is empty",
  CART_TOO_LARGE: "Cart is too large",
  CART_DUPLICATES: "Cart has repeated items",
  CART_ITEM_GONE: "An item in the cart no longer exists",
  INSUFFICIENT_STOCK: "Not enough stock for an item in the cart",
  PRICE_INVALID: "Price is not valid",
  NAME_REQUIRED: "Name is required",
  SLUG_REQUIRED: "Slug is required",
  SLUG_INVALID: "Slug only allows lowercase letters, numbers and hyphens",
  DESCRIPTION_REQUIRED: "Description is required",
  IMAGE_URL_INVALID: "Image URL is not valid",
  STOCK_INVALID: "Stock must be an integer greater than or equal to 0",
  VARIANT_NOT_FOUND: "Variant not found",
  PRODUCT_NOT_FOUND: "Product not found",
  PAYMENTS_UNCONFIGURED: "The payment gateway is not configured",
  WEBHOOK_UNCONFIGURED: "Webhook not configured",
  WEBHOOK_SIGNATURE: "Invalid webhook signature",
};

class AppError extends Error {
  constructor(code, status) {
    super(MESSAGES[code] ?? code);
    this.code = code;
    this.status = status;
  }
}

class NotFoundError extends AppError {
  constructor(code = "NOT_FOUND") {
    super(code, 404);
  }
}

class BadRequestError extends AppError {
  constructor(code = "BAD_REQUEST") {
    super(code, 400);
  }
}

module.exports = { AppError, NotFoundError, BadRequestError, MESSAGES };
