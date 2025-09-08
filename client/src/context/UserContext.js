// Controller to request and manage list items data/state
import React, { useState, useEffect, useContext } from "react";
import { createContext } from "react";
import getUserInfoController from "../controller/user/getInfo";
import { useCookies } from "react-cookie";
import { socket } from "../service/socket";
import { MessageContext } from "./MessageContext";

const UserContext = createContext();


/**
 * Context Provides the Current Login User Information
 */
function UserProvider(props) {
  const [user, setUser] = useState({});

  const { setError } = useContext(MessageContext);

  const [cookies] = useCookies(["_userId"]);

  useEffect(() => {
    if (cookies._userId) {
      async function getUserInfo() {
        const res = await getUserInfoController(cookies._userId);
        if (res.success) {
          setUser(res.data);
          socket.emit("subscribe", {user: res.data});
        } else {
          setError(res.message);
        }
      }
      getUserInfo();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
