import React, { useState, useEffect } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { socket } from "../../service/socket";

const useStyles = makeStyles((theme) => ({
  number: {
    color: theme.palette.primary.main,
    fontWeight: "600",
    marginLeft: "15px",
  },
}));

export default function RoomStatistics(props) {
  const [totalUserCount, setTotalUserCount] = useState(0);

  const classes = useStyles();

  useEffect(() => {
    socket.removeEventListener('userCount');
    socket.emit("getTotalUserCount");
    socket.on("userCount", (res) => {
      setTotalUserCount(res);
    });
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      padding="15px"
      borderRadius="10px"
      border="1px solid lightgrey"
      mb="20px"
    >
      <Typography>
        Room Total
        <span className={classes.number}>
          {props.rooms.length || "No Room"}
        </span>
      </Typography>
      <Typography>
        Waiting
        <span className={classes.number}>
          {props.rooms.filter((e) => e.isOngoing === false).length}
        </span>
      </Typography>
      <Typography>
        Players<span className={classes.number}>{totalUserCount}</span>
      </Typography>
    </Box>
  );
}
