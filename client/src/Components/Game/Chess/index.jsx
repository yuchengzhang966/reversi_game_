import React, { useState, useEffect, useContext } from "react";
import { useSpring, animated as a } from "react-spring";
import { GameContext } from "../../../context/GameContext";
import ReactCardFlip from "react-card-flip";
import { Grow } from "@material-ui/core";
// import "./chess.css";

export default function Chess(props) {
  const [flipped, setFlipped] = useState(false);


  useEffect(() => {
    setFlipped(!flipped)
  }, [])


  function chess(letter, side) {
    switch (letter) {
      case "X":
        return side === "front" ? <>⚫</> : <>⚪</>;
      case "O":
        return side === "front" ? <>⚪</> : <>⚫</>;
      default:
        return <></>;
    }
  }

  return (
    <>
        <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
          <div>{chess(props.letter, "front")}</div>
          <div>{chess(props.letter, "back")}</div>
        </ReactCardFlip>
    </>
  );
}
