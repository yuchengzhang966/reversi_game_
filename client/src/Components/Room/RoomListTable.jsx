import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import RoomItem from "./RoomItem";
import NoRoomPlaceHolder from "../../../src/Asset/img/undraw_gaming_6oy3.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
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
  number: {
    color: theme.palette.primary.main,
    fontWeight: "600",
    marginLeft: "15px",
  },
}));

export default function RoomListTable(props) {
  const classes = useStyles();


  return (
    <List className={classes.root}>
      {props.rooms.length < 1 && (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
          <img
            style={{ width: "400px", marginTop: "60px", marginBottom:'40px' }}
            src={NoRoomPlaceHolder}
          />
          <Typography variant="h5">Create Room And Start</Typography>
        </Box>
      )}
      {props.rooms.map((e) => {
        return <RoomItem players={e.currentPlayers} {...e} />;
      })}
    </List>
  );
}
