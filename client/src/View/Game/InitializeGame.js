import React, { useEffect, useState, useContext } from "react";

// UI
import Loading from "../../Components/Loading";
import { Box } from "@material-ui/core";

import { socket } from "../../service/socket";
import { GameContext } from "../../context/GameContext";
import { UserContext } from "../../context/UserContext";


export default function InitializeGame() {
  const { room, setInitialized, game, setGame, setSide } = useContext(
    GameContext
  );
  const { user } = useContext(UserContext);

  const [status, setStatus] = useState("");

  const setPlayerSide = () => {
    if (game) {
      if (game.playerX && game.playerO) {
        setSide(game.playerX === user._id ? "X" : "O");
      }
    }
  };

  // Set player side when updated
  useEffect(() => setPlayerSide(), [game]);

  useEffect(() => {
    setStatus("Initializing Game");
    socket.on("joinGame", (res) => {
      if (res.data.currentPlayers.length === 2) {
        setStatus("Both Player Joined");
        setGame(res.data);
        setInitialized(true);
      }else{
        setStatus("Waiting for another player");
      }
      }
    );

    socket.on("playerCanJoin", (res) => {
      if (res.data) {
        socket.emit("joinGame", { gameId: res.data._id });
      }
    });

    // socket.on("reConnectToGame", (res) => {
    //   if(res.data){
    //     setGame(res.data);
    //     setInitialized(true);
    //   }
    // })

    // Only allow the game initialized by the host
    if (user._id === room.roomHost) {
      socket.emit("initializeGame", {
        userId: user._id,
        roomId: room._id,
        roomCode: room.roomId,
      });
    }
  }, []);

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignContent="center"
        alignItems="center"
        height="100vh"
      >
        <Loading />
        <h4 style={{ color: "#4B4E4F" }}>{status}</h4>
      </Box>
    </>
  );
}
