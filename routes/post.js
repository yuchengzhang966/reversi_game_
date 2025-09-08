const router = require("express").Router();
const verify = require("./verifyToken");

// verify is a middleware that verify the token
router.get("/", verify, (req, res) => {
  res.status(200).json({
    message: "Success",
    validToken: true,
    user: req.user,
  });
});

module.exports = router;
