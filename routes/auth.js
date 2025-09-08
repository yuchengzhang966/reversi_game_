const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../utils/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("redis");
const RedisClient  = redis.createClient();


/**
 * Register User
 * @endpoint: /register
 * @method: POST
 * @description:Register user and return user info
 */
router.post("/register", async (req, res) => {

  //check if the combination is valid 
  const { error } = registerValidation(req.body);
  if (error) return res.status(200).send({ message: error.details[0].message });

  // check if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(200).send({ message: "Email Exist", success: false });
  }

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    avatar: req.body.avatar,
  });

  // save the user in the database, and respond
  try {
    const savedUser = await user.save();
    res.json({success: true, message: "Register Success", user: savedUser});
  } catch (err) {
    res.send({ success: false, message: err.message });
    res.status(400).json({ message: err.message });
  }
});

/**
 * @api {post} /login Login User
 * @apiName Login
 * @apiDescription Login and return token and user info
 * @apiGroup User
 *
 * @apiParam {String} User Email
 * @apiParam {String} Password
 *
 * @apiSuccess {String} token
 * @apiSuccess {String} user_info
 */

router.post("/login", async (req, res) => {
  //basic step of validation: check things like length
  const { error } = loginValidation(req.body);
  if (error) return res.status(200).send({ message: error.details[0].message });
  // if the email exist in the database
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(200).json({ message: "Email Not Found" });
  }

  //check if the password is right
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(200).json({ message: "Password Incorrect" });
  }

  //create a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET,{expiresIn: '24h'});


  // sign in and return token and user info
  res
    .header("auth-token", token)
    .status(200)
    .json({
      message: "UserSignedIn",
      time: Date.now(),
      token: token,
      user: user,
    });

  //res.send(token,savedUser);
});



/**
 * Logout User
 * @endpoint: /logout
 * @method: GET
 * @description:logout the user
 */
router.get("/logout", async (req, res) => {

  // get token by header and store it in the redis, set the token
  const token = req.header("auth-token");
  RedisClient.setex(token,86400,"invalid");

  // the key expires in 24 hours
  //RedisClient.expire(token,86400);
 res.json({success: true, message: "User Logged Out!"})

});


module.exports = router;
