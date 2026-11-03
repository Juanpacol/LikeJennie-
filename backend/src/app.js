const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const paymentRoutes = require("./routes/payment.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const authMiddleware = require("./middlewares/auth.middleware");
const errorMiddleware = require("./middlewares/error.middleware");
const { MESSAGES } = require("./utils/errors");
const { apiLimiter, loginLimiter, checkoutLimiter } = require("./middlewares/rateLimit.middleware");

const app = express();

// Detrás del proxy de Render: sin esto todas las peticiones parecerían venir de la misma IP y el
// límite de intentos las contaría juntas.
app.set("trust proxy", 1);
// Cabeceras de seguridad (quita X-Powered-By, agrega nosniff, HSTS, etc.).
app.use(helmet());
app.use(cors());
// El webhook de Stripe necesita el cuerpo crudo: el JSON se parsea en el resto de rutas.
app.use((req, res, next) =>
  req.originalUrl === "/api/payments/webhook" ? next() : express.json()(req, res, next),
);

app.use("/api", apiLimiter);
app.use("/api/admin/auth/login", loginLimiter);
app.use("/api/payments/checkout", checkoutLimiter);

app.get("/api/health", (req, res) => res.json({ success: true, data: "ok" }));

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);

// Ruta inexistente: JSON como el resto de la API, no la página HTML por defecto de Express.
app.use((req, res) => res.status(404).json({ success: false, code: "ROUTE_NOT_FOUND", error: MESSAGES.ROUTE_NOT_FOUND }));

app.use(errorMiddleware);

module.exports = app;
