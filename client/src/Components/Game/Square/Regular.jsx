import React from "react";

export default function RegularChess(props) {
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

  return <>{chess(props.letter, "front")}</>;
}
