import React, { useState, useEffect, useContext } from "react";
import UserLoginRegContext from "./store/context";

export default function RandomAvatar() {
  const { setAvatar, avatar } = useContext(UserLoginRegContext);

  useEffect(() => {
    const seed = Math.random().toString(36).substring(7);
    setAvatar(`https://avatars.dicebear.com/api/avataaars/${seed}.svg`);
  }, []);

  const onClick = () => {
    const seed = Math.random().toString(36).substring(7);
    setAvatar(`https://avatars.dicebear.com/api/avataaars/${seed}.svg`);
  };

  return (
    <>
      <img src={avatar} onClick={onClick} style={{cursor: "pointer"}} />
    </>
  );
}
