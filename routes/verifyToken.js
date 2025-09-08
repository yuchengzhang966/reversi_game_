const jwt = require("jsonwebtoken");
const redis = require("redis");
const RedisClient = redis.createClient();

/**
 * authenticate the validility of user accessing their own page
 * @header   auth-token
 */
function auth(req, res, next) {
  // if it has a token
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ message: "AccessDenied", validToken: false });
    return;
  }
  RedisClient.get(token, (err, data) => {
    if (err) throw err;
    if (data === "invalid") {
      res.status(401).send({
        message: "Invalid Token",
        validToken: false,
      });
    } else {
      try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
      } catch (err) {
        res.status(400).send({ message: "AccessDenied", validToken: false });
      }
    }
  });
}

module.exports = auth;
