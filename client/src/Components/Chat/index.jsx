import React, { useEffect, useContext, useState } from "react";
import { socket } from "../../service/socket";
import {
  Widget,
  toggleWidget,
  addResponseMessage,
  dropMessages,
  addUserMessage,
} from "react-chat-widget";
import "./style.css";

// Controller
import { UserContext } from "../../context/UserContext";
import { GameContext } from "../../context/GameContext";

export default function Chat(props) {
  const { user } = useContext(UserContext);
  const { players } = useContext(GameContext);

  const [oppoAvatar, setOppoAvatar] = useState({ avatar: "" });

  useEffect(() => {
    // Remove Previous Listeners
    socket.removeEventListener("ReceivedChatMessage");
    socket.on("ReceivedChatMessage", (res) => {
      console.log(res);
      console.log(socket._callbacks);
      addResponseMessage(res.message);
    });

    // Join Room
    socket.emit(
      "joinChat",
      {
        name: user.name,
        roomCode: props.roomCode,
      },
      console.log("send!")
    );

    dropMessages();
    var hasClass = document.getElementsByClassName("rcw-hide-sm");
    if (hasClass.length === 0) {
      toggleWidget();
    }

    addUserMessage(`You've joined Chat Room`)

  }, []);

  useEffect(() => {
    const filtered = players.filter((e) => e._id !== user._id);
    if (filtered.length > 0) {
      setOppoAvatar(filtered[0]);
    }
  }, [players]);

  const handleSentMessage = (event) => {
    socket.emit("sendChatMessage", {
      userId: user._id,
      name: user.name,
      message: event,
      time: Date.now(),
      roomCode: props.roomCode,
    });
  };

  return (
    <>
      <Widget
        title="Chat"
        subtitle={"Online"}
        titleAvatar={user.avatar}
        profileAvatar={oppoAvatar.avatar || ""}
        senderPlaceHolder="Press Enter To Send Message"
        handleNewUserMessage={handleSentMessage}
      />
    </>
  );
}
