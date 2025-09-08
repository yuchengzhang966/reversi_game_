import React, { useEffect, useState, useContext } from "react";
import { Box, Button, Backdrop, Grid, Container } from "@material-ui/core";
import GameUserInfo from "../../Components/GameUserInfo";
import { useParams, useHistory } from "react-router-dom";
import { socket } from "../../service/socket";
import { makeStyles } from "@material-ui/core/styles";
import Loading from "../../Components/Loading";
import LogoHeader from "../../Components/LogoHeader";
import Game from "../Game";
import Chat from "../../Components/Chat";

// Context
import { GameContext } from "../../context/GameContext";
import { UserContext } from "../../context/UserContext";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function WaitingRoom() {
  const { id } = useParams();
  const history = useHistory();
  const classes = useStyles();

  const [valid, setValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const { room, setRoom, players, setPlayers } = useContext(GameContext);
  const { user } = useContext(UserContext);

  // get user info
  const currentUser = JSON.parse(window.localStorage.getItem("_user"));
  // Join the waiting room

  useEffect(() => {
    socket.on("joinRoom", (res) => updateRoom(res));
    socket.on("leaveRoom", (res) => updateRoom(res));
    socket.on("sessionExpired", () => {
      setDisabled(true);
      socket.disconnect();
    });
    socket.on("onInitializing", () => {
      setGameStart(true);
    });
    setLoading(true);
    socket.emit("joinRoom", {
      roomId: id,
      user: currentUser.name,
      userId: currentUser._id,
    });
  }, []);

  const updateRoom = (res) => {
    if (res.data) {
      setRoom(res.data);
      setPlayers(res.data.currentPlayers);
      setLoading(false);
    } else {
      setValid(false);
      alert(res.message + " reason: " + res.error);
      history.replace("/");
    }
  };

  // useEffect(() => {
  //   console.log(room);
  //   console.log(room.isOngoing);
  //   if (room.isOngoing) {
  //     socket.emit("reConnectToGame", { gameId: room.gameId });
  //     setGameStart(true);
  //   }
  // }, [room]);

  const onLeaveRoom = () => {
    socket.emit("leaveRoom", { roomId: id, userId: currentUser._id });
    history.replace("/");
  };

  const onStartGame = () => {
    setGameStart(true);
  };

  return (
    <>
      <Backdrop className={classes.backdrop} open={disabled}>
        <h2>Oops :( seems like you have another connection</h2>
      </Backdrop>
      <Box display="flex" justifyContent="center">
        <Chat roomCode={id} />
      </Box>
      {gameStart ? (
        <Game />
      ) : (
        <Container>
          <Box mt="10px">
            <LogoHeader />
          </Box>
          <Box display="flex" justifyContent="center" mt="10px">
            <h1>Room # {id}</h1>
          </Box>
          <>
            {loading ? (
              <Box display="flex" justifyContent="center" mt="20px">
                <Loading />
              </Box>
            ) : (
              <>
                <Box display="flex" justifyContent="center" mt="40px">
                  <GameUserInfo users={players} />
                </Box>
                <Box display="flex" justifyContent="center" mt="40px">
                  {players.length === 2 && user._id === room.roomHost ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={onStartGame}
                    >
                      Start
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" disabled>
                      Start
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginLeft: "20px" }}
                    onClick={onLeaveRoom}
                  >
                    Leave
                  </Button>
                </Box>
              </>
            )}
          </>
        </Container>
      )}
    </>
  );
}
