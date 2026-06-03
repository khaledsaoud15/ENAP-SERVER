const express = require("express");
const connectDB = require("./db/db");
const app = express();
require("dotenv").config();
app.use(express.json());

const cookieParser = require("cookie-parser");

app.use(cookieParser());

const cors = require("cors");
app.use(
  cors({
    origin: "https://enap-auth-test-project.vercel.app/",
    credentials: true,
  }),
);

connectDB();

app.use("/api/v1/auth", require("./routes/user.route"));
app.use("/api/v1/", require("./routes/product.route"));

app.get("/test", (req, res) => {
  res.json("Hello");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port : http://localhost:${3000}`);
});
