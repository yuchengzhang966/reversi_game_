import React, { useState, useContext, useEffect } from "react";
import { GameContext } from "../../../context/GameContext";
import Chess from "../Chess";
import RegularChess from "./Regular";

export default function Square(props) {
  const [value, setValue] = useState(null);
  const [instruction, setInstruction] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const { setLastMove, availableMoves, flippedCells } = useContext(GameContext);

  useEffect(() => {
    if (availableMoves.includes(props.value)) {
      setInstruction(true);
    } else {
      setInstruction(false);
    }
    if (flippedCells.includes(props.value)) {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
    }
  });

  const onClick = () => {
    setLastMove(props.value);
  };

  return (
    <>
      {instruction ? (
        <button className="square-ava" onClick={onClick}>
          <RegularChess letter={props.letter} value={props.value} />
        </button>
      ) : (
        <button className="square" onClick={onClick}>
          <>
            <RegularChess letter={props.letter} value={props.value} />
          </>
        </button>
      )}
    </>
  );
}
