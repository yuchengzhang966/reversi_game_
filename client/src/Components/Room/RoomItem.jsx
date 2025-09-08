import React from "react";
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  Box,
  Divider,
  Button,
} from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: "10px",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  divider: {
    marginLeft: "115px",
  },
  status: {
    marginTop: "10px",
    marginRight: "10px",
  },
  vsTag: {
    color: theme.palette.primary.main,
    fontWeight: "600",
  },
  roomId: {
    color: "white",
    fontWeight: "600",
    marginTop: "5px",
    marginBottom: "5px",
  },
}));

export default function RoomItem(props) {
  const classes = useStyles();

  const history = useHistory();

  const handleJoinRoom = () => {
    history.push("/room/" + props.roomId);
  };

  return (
    <>
      <ListItem alignItems="flex-start" className={classes.root}>
        <ListItemAvatar>
          <AvatarGroup max={2} style={{ marginRight: "20px" }}>
            {props.players.map((e) => (
              <Avatar alt="No Avatar" src={e.avatar} />
            ))}
            {props.players.length < 2 && <Avatar alt="No Avatar" />}
          </AvatarGroup>
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              {props.players.map((e, i) => (
                <span className="focus-in-expand">
                  {e.name}{" "}
                  {i === 0 && props.players.length > 1 && (
                    <span className={classes.vsTag}>vs.&nbsp;</span>
                  )}
                </span>
              ))}
            </>
          }
          secondary={
            <>
              <Box display="flex">
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {props.isFull && (
                    <Chip
                      className={classes.status}
                      color="primary"
                      label="Full"
                      variant="outlined"
                    />
                  )}
                  <Chip
                    className={classes.status}
                    label={props.isOngoing ? "Ongoing" : "Waiting"}
                    variant="outlined"
                  />
                </Typography>
              </Box>
            </>
          }
        />
        <Box mt="30px">
          <Tooltip
            title={
              <Typography>
                Join Room{" "}
                <Typography className={classes.roomId}>
                  {props.roomId}
                </Typography>
              </Typography>
            }
            placement="top"
          >
            <Button
              size="medium"
              variant="outlined"
              align="right"
              onClick={handleJoinRoom}
              disabled={props.isFull || props.isOngoing}
            >
              <Typography>Join</Typography>
            </Button>
          </Tooltip>
        </Box>
      </ListItem>
      <Divider />
    </>
  );
}
