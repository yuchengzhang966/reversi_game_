import React, { useState, useEffect, useContext } from "react";
import { Grid, Box, Backdrop, Button } from "@material-ui/core";
import Game from "../../Components/Game";
import ScoreCounter from "../../Components/Game/ScoreCounter";
import GameUserInfo from "../../Components/GameUserInfo";
import GameEndDialog from "../../Components/Game/GameEnd/";
import { socket } from "../../service/socket";

import { useHistory } from "react-router-dom";

// Controller
import { GameContext } from "../../context/GameContext";
import { UserContext } from "../../context/UserContext";
import { MessageContext } from "../../context/MessageContext";

export default function GamePlayPage() {
  const { user } = useContext(UserContext);
  const {
    lastMove,
    room,
    game,
    setGame,
    side,
    setAvailableMoves,
    setGameEnd,
    setPlayers,
    players,
    setGameResult,
    setRoom,
    setFlippedCells,
  } = useContext(GameContext);
  const { setError } = useContext(MessageContext);

  const [gameLastMove, setGameLastMove] = useState(false);
  const history = useHistory();

  const updateRoom = (res) => {
    if (res.data) {
      setRoom(res.data);
      setPlayers(res.data.currentPlayers);
    } else {
      alert(res.message + " reason: " + res.error);
      history.replace("/");
    }
  };

  useEffect(() => {
    if (lastMove) {
      if (game.turn === side) {
        socket.emit("chessDown", {
          room: room.roomId,
          lastMove: lastMove,
          userId: user._id,
          side: side,
          board: game.board,
          gameId: game._id,
        });
        setAvailableMoves([]);
      } else {
        setError("Not Your Turn!");
      }
    }
  }, [lastMove]);

  useEffect(() => {
    if (gameLastMove) {
      socket.emit("gameEnd", {
        gameId: game._id,
        roomId: room._id,
      });
    }
  }, [gameLastMove]);

  useEffect(() => {
    socket.on("chessDown", (res) => {
      if (res.data.turn === side) {
        socket.emit("availableMoves", {
          board: res.data.board,
          side: side,
        });
      }
      setGame(res.data);
      setFlippedCells(res.data.flippedCells);
    });
    socket.on("availableMoves", (res) => {
      setAvailableMoves(res.data);
    });
    socket.on("OppoNoAvailableMoves", () => {
      setGameLastMove(true);
    });
    socket.on("gameEnd", (res) => {
      setGameEnd(true);
      setGameResult(res.data);
    });
    socket.on("leaveRoom", (res) => {
      updateRoom(res);
    });
  }, []);

  const handleExit = () => {
    socket.emit("leaveRoom", { roomId: room.roomId, userId: user._id });
    history.replace("/");
  };

  return (
    <Box
      display="flex"
      width="100vw"
      height="90vh"
      justifyContent="center"
      alignContent="center"
      alignItems="center"
    >
      <GameEndDialog />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        direction="row-reverse"
      >
        <Grid item lg={3} md={2} sm={0}>
          &nbsp;
        </Grid>
        <Grid item sm={12} sm={12} md={6} lg={6}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Box display="flex" justifyContent="center" mb="40px">
              <ScoreCounter />
            </Box>
            <Game />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={1}>
          <Box
            display="flex"
            flexDirection="column"
            mt="50px"
            alignItems="center"
          >
            <Box>
              <GameUserInfo users={players} userId={user._id} />
            </Box>
            <Box marginTop="20px">
              <Button
                variant="contained"
                color="primary"
                style={{ width: "280px" }}
                disabled
              >
                Give Up
              </Button>
            </Box>
            <Box marginTop="10px">
              <Button
                variant="contained"
                color="secondary"
                style={{ width: "280px" }}
                onClick={handleExit}
              >
                Exit
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
