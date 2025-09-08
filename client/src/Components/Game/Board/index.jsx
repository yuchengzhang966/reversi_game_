import React, { useContext, useEffect } from "react";
import Row from "./Row";
import { GameContext } from "../../../context/GameContext";

export default function Board() {
  const { game } = useContext(GameContext);
  
  const board = game.board;


  return (
    <>
      {/* <div className="status">{status}</div> */}
      {board.map((e, i) => {
        if (i % 8 === 0) {
          return <Row key={'row' + i} row={i / 8} board={board.slice(i, i + 8)} />;
        }
      })}
    </>
  );
}
