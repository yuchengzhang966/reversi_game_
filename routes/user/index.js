const router = require("express").Router();
const User = require("../../model/User");
const jwt = require("jsonwebtoken");
const verify = require("../verifyToken");
const { getUserLeaderBoard } = require("../../controller/user/index");

router.get("/userLeaderBoard/:count", async (req, res) => {
  try {
    const leaderBoard = await getUserLeaderBoard(req.params.count);
    res.json(leaderBoard);
  } catch (e) {
    res.json({
      message: "Unable to get LeaderBoard",
      error: e.message,
      data: {},
    });
  }
});

router.get("/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    // res.status(500).json({ message: "Unable To Find User" });
  }
});

module.exports = router;
