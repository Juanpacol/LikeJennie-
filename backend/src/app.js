const express = require("express");
const cors = require("cors");

const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const authMiddleware = require("./middlewares/auth.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
// El webhook de Stripe necesita el cuerpo crudo: el JSON se parsea en el resto de rutas.
app.use((req, res, next) =>
  req.originalUrl === "/api/payments/webhook" ? next() : express.json()(req, res, next),
);

app.get("/api/health", (req, res) => res.json({ success: true, data: "ok" }));

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);

app.use(errorMiddleware);

module.exports = app;
