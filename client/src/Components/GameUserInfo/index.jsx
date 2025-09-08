import React, { useContext } from "react";
import { Grid, Box, Avatar, Typography, Divider } from "@material-ui/core";
import InfoBox from "./InfoBox";
import { GameContext } from "../../context/GameContext";

export default function GameUserInfo(props) {
  
  const { game } = useContext(GameContext);

  return (
    <>
      <Box display="flex" flexDirection="column">
        {props.users.map((e) => {
          if (game) {
            if (e._id === game.playerX) {
              return <InfoBox {...e} side="X"/>;
            } else if (e._id === game.playerO ) {
              return <InfoBox {...e} side="O"/>;
            }
          } else {
            return <InfoBox {...e} />;
          }
        })}
      </Box>
    </>
  );
}
