const router = require("express").Router();
const game = require("../../controller/game");

// Game Model
const Game = require("../../model/Game");

/**
 * Initialize Game
 * POST
 * @body userId 
 */
router.post("/initializeGame", async (req, res) => {
  const gameInfo = await game.initializeGame(req.body.userId);
  res.json({
    message: gameInfo.message,
    data: gameInfo.data,
  });
});


module.exports = router;
