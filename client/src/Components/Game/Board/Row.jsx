import React, {useContext} from "react";
import Square from "../Square";

export default function Row(props) {


  return (
    <div className="board-row">
      {props.board.map((e, i) => {
        return (
          <Square
            value={`${String.fromCharCode(65 + i) + (parseInt(props.row) + 1)}`}
            letter={e}
            key={`${String.fromCharCode(65 + i) + (parseInt(props.row) + 1)}`}
          />
        );
      })}
    </div>
  );
}
