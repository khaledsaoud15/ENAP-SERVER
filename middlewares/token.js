const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  const token = req.headers["x-auth-token"];

  if (!token) {
    return res.status(401).json({ message: "You are not authorized" });
  }

  try {
    jwt.verify(token, process.env.JWT_ACCESS, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      if (decoded.role === "admin") {
        req.user = decoded;
        next();
      } else {
        res.status(401).json({ message: "You are not authorized" });
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

module.exports = {
  verifyAdmin,
};
