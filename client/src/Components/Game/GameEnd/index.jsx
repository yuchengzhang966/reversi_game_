import React, { useContext, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Avatar, Grid } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import CountUp from "react-countup";
// Context
import { UserContext } from "../../../context/UserContext";
import { GameContext } from "../../../context/GameContext";

import { useHistory } from "react-router-dom";
// Socket
import { socket } from "../../../service/socket";

const useStyle = makeStyles({
  avatar: {
    width: "180px",
    height: "160px",
  },
  badge: {
    marginRight: "40px",
  },
  username: {
    fontSize: "25px",
    marginTop: "10px",
  },
});

export default function GameEndDialog() {
  const [open, setOpen] = useState(true);
  const history = useHistory();

  const classes = useStyle();

  const { user } = useContext(UserContext);
  const { gameEnd, room, players, gameResult } = useContext(GameContext);

  const onBackToRoom = () => {
    if (user.currentRoom) {
      history.push(`/room/${user.currentRoom}`);
    } else {
      history.replace("/");
    }
    setOpen(false);
  };

  const onLeaveRoom = () => {
    socket.emit("leaveRoom", { roomId: room.roomId, userId: user._id });
    setOpen(false);
    history.replace("/");
  };

  useEffect(() => {
    setOpen(gameEnd);
  }, [gameEnd]);

  return (
    <div>
      {user && gameResult && (
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-game-end"
          aria-describedby="alert-dialog-description"
          disableBackdropClick
          disableEscapeKeyDown
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-game-end">
              <h2 style={{ textAlign: "center" }}>
                {user && gameResult && (
                  <>
                    {gameResult.draw ? (
                      <>Draw!!</>
                    ) : (
                      <>
                        {user._id === gameResult.winnerId ? (
                          <>Congratulations! You Win{" 🎉"}</>
                        ) : (
                          <>You Lose {" 🙁"}</>
                        )}
                      </>
                    )}
                  </>
                )}
              </h2>
              <Box display="flex" justifyContent="center" padding="50px">
                {players.map((e) => {
                  return (
                    <>
                      {e._id === gameResult.winnerId && (
                        <>
                          <Box display="flex" flexDirection="column">
                            <Avatar className={classes.avatar} src={e.avatar}>
                              H
                            </Avatar>
                            <Badge
                              className={classes.badge}
                              badgeContent={"Winner"}
                              overlap="circle"
                              color="primary"
                            ></Badge>
                            <Box
                              display="flex"
                              justifyContent="center"
                              mt="10px"
                            >
                              <span className={classes.username}>{e.name}</span>
                            </Box>
                          </Box>
                        </>
                      )}
                    </>
                  );
                })}
              </Box>
              <p>
                <Box textAlign="center">Score you have earned</Box>
                <Box textAlign="center">
                  <strong
                    style={{
                      color: "#7C4DFF",
                      marginLeft: "10px",
                      fontSize: "40px",
                    }}
                  >
                    <CountUp
                      duration={3}
                      end={
                        user._id === gameResult.winnerId
                          ? parseInt(gameResult.scoreEarn)
                          : 0
                      }
                    />
                  </strong>{" "}
                </Box>
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Grid container spacing={1} direction="column">
              <Grid item xs>
                <Button
                  onClick={onBackToRoom}
                  color="primary"
                  variant="contained"
                  fullWidth
                >
                  Back to Room
                </Button>
              </Grid>
              <Grid item xs>
                <Button
                  onClick={onLeaveRoom}
                  color="secondary"
                  variant="contained"
                  fullWidth
                >
                  Exit
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
