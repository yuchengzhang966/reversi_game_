import React, { useState, createContext } from "react";

const GameContext = createContext();

function GameProvider(props) {
  const [room, setRoom] = useState("");
  const [players, setPlayers] = useState([]);
  const [initialized, setInitialized] = useState(false);

  const [game, setGame] = useState();
  const [lastMove, setLastMove] = useState();
  const [side, setSide] = useState();
  const [availableMoves, setAvailableMoves] = useState([]);
  const [gameEnd, setGameEnd] = useState(false);
  const [gameResult, setGameResult] = useState();
  const [flippedCells, setFlippedCells] = useState([]);

  const contexts = {
    room,
    setRoom,
    players,
    setPlayers,
    initialized,
    setInitialized,
    game,
    setGame,
    lastMove,
    setLastMove,
    side,
    setSide,
    availableMoves,
    setAvailableMoves,
    gameEnd,
    setGameEnd,
    gameResult,
    setGameResult,
    flippedCells,
    setFlippedCells,
  };

  return (
    <GameContext.Provider value={contexts}>
      {props.children}
    </GameContext.Provider>
  );
}

export { GameContext, GameProvider };
