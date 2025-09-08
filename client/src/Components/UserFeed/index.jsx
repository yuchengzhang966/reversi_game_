import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

import Avatar from "@material-ui/core/Avatar";

// socket
import { socket } from "../../service/socket";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 300,
  },
}));

export default function UserFeed() {
  const classes = useStyles();
  const [userList, setUserList] = useState([]);

  const filterUserList = (list) => {
    const filteredNull = list.filter((e) => e !== null);
    const filtered = filteredNull.reduce((unique, o) => {
      if (!unique.some((obj) => obj.email === o.email)) {
        unique.push(o);
      }
      return unique;
    }, []);
    return filtered;
  };

  useEffect(() => {
    socket.emit("onlineUserList", (res) => setUserList(filterUserList(res)));
    socket.on("updateOnlineUserList", (res) =>
      setUserList(filterUserList(res))
    );
  }, []);

  return (
    <List className={classes.root} subheader={<li />}>
      <ListSubheader>
        {"Online Players "} ({userList.length})
      </ListSubheader>
      {userList.map((e) => (
        <ListItem key={`${e.email}`}>
          <ListItemAvatar>
            <Avatar alt={e.name} src={e.avatar} />
          </ListItemAvatar>
          <ListItemText primary={e.name} />
        </ListItem>
      ))}
    </List>
  );
}
