const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    req.user = user;
    next();

  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Token failed" });
  }
};

module.exports = protect;
