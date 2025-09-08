// Controller to request and manage list items data/state
import React, { useState, useEffect } from "react";
import { createContext } from "react";
import { socket } from "../service/socket";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const MessageContext = createContext();

/**
 * Context Provides the Current Login User Information
 */
function MessageProvider(props) {
  const [error, setError] = useState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    socket.on("errormsg", (res) => {
      setOpen(true);
      setError(res.message);
    });
  }, []);

  useEffect(() => {
    if (error) {
      setOpen(true);
      setTimeout(() => setOpen(false), 2500);
    }
  }, [error]);

  return (
    <MessageContext.Provider value={{ error, setError }}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity="error">
          {error}
        </Alert>
      </Snackbar>
      {props.children}
    </MessageContext.Provider>
  );
}

export { MessageContext, MessageProvider };
