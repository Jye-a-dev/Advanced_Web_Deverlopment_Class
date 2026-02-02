const jwt = require("jsonwebtoken");
const MyConstants = require("./MyConstants");

const JwtUtil = {
  genToken(username) {
    return jwt.sign(
      { username },
      MyConstants.JWT_SECRET,
      { expiresIn: MyConstants.JWT_EXPIRES }
    );
  },

  checkToken(req, res, next) {
    const token =
      req.headers["x-access-token"] ||
      req.headers["authorization"];

    if (!token) {
      return res.json({
        success: false,
        message: "Auth token is not supplied",
      });
    }

    jwt.verify(token, MyConstants.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Token is not valid",
        });
      }

      req.decoded = decoded;
      next();
    });
  },
};

module.exports = JwtUtil;
