const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");

const authRoutes = require("./routes/auth");
const wineryRoutes = require("./routes/wineryRoutes");
const wineRoutes = require("./routes/wineRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/wineries", wineryRoutes);
app.use("/api/wine", wineRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
