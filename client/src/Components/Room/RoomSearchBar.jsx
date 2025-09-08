import React, { useState, useContext } from "react";
import {
  Grid,
  Box,
  OutlinedInput,
  ButtonGroup,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import { UserContext } from "../../context/UserContext";

// Controller
import createRoom from "../../controller/room/createRoom";

const useStyle = makeStyles({
  button: {
    padding: "20px",
    width: "80px",
  },
});

export default function RoomSearchBar() {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  const history = useHistory();

  const onCreateRoom = async () => {
    setLoading(true);
    const res = await createRoom(user._id);
    setLoading(false);
    res.success ? setRoom(res.data.roomId) : console.error(res.message);
    onJoiningRoom(res.data.roomId);
  };

  const onJoiningRoom = async (roomId) => {
    if (typeof roomId === "string") {
      setLoading(true);
      setTimeout(() => history.push(`/room/${roomId}`), 2000);
    }
  };

  const loadingProp = () =>
    loading
      ? {
          endAdornment: (
            <Box pr="15px">
              <div class="dot-windmill" />
            </Box>
          ),
          placeholder: "Loading",
          disabled: true,
        }
      : {};

  const classes = useStyle();
  return (
    <>
      <Grid
        container
        direction="row"
        spacing={3}
        justify="center"
        alignItems="center"
      >
        <Grid item xs={0} sm={2}>
          &nbsp;
        </Grid>
        <Grid item xs={8} sm={7}>
          <Box display="flex" justifyContent="center">
            <OutlinedInput
              fullWidth
              placeholder="Room Code"
              inputProps={{
                style: {
                  textAlign: "center",
                  fontSize: "30px",
                  fontWeight: "500",
                  textTransform: "uppercase",
                },
              }}
              {...loadingProp()}
              value={room}
              onChange={(e) => setRoom((e.target.value).toUpperCase())}
            />
          </Box>
        </Grid>
        <Grid item xs={4} sm={3}>
          <ButtonGroup disableRipple>
            <Tooltip title="Join room by code" placement="top">
              <Button
                className={classes.button}
                variant="contained"
                size="large"
                color="primary"
                disabled={loading}
                onClick={() => onJoiningRoom(room)}
              >
                Join
              </Button>
            </Tooltip>
            <Tooltip title="Create a new room" placement="top">
            <Button
              className={classes.button}
              variant="contained"
              size="large"
              color="secondary"
              disabled={loading}
              onClick={onCreateRoom}
            >
              Create
            </Button>
            </Tooltip>
          </ButtonGroup>
        </Grid>
      </Grid>
    </>
  );
}
