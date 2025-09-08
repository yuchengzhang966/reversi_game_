import React, { useContext, useState } from "react";
import { Grid, Box } from "@material-ui/core/";
import { GameContext } from "../../../context/GameContext";
import CountUp from 'react-countup';


const style = {
  border: "solid 2px #9B9B9B",
  padding: "10px",
  paddingLeft: "20px",
  borderRadius: "10px",
  boxSizing: "border-box",
};

export default function ScoreCounter() {
  const { room, game } = useContext(GameContext);


  return (
    <div style={{ width: "250px", height: "56px" }}>
      <Grid container direction="row" style={style} spacing={1}>
        <Grid item xs={6}>
          <Box mt="3px">
            {" "}
            <strong>ID:</strong> {room.roomId}
          </Box>
        </Grid>
        <Grid item xs={3}>
          ⚫&nbsp;<CountUp duration={0.5} end={game.scoreX || 0} />
        </Grid>
        <Grid item xs={3}>
          ⚪&nbsp;<CountUp duration={0.5} end={game.scoreO || 0} />
        </Grid>
      </Grid>
    </div>
  );
}
