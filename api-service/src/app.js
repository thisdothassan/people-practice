const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {
  authRoutes,
  customerRoutes,
  orderRoutes,
  managerRoutes,
  productRoutes,
  locationRoutes,
} = require("./routes");
const { errorHandler, requestLogger } = require("./middleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/locations", locationRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
