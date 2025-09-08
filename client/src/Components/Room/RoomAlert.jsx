import React, { useContext, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// Context 
import { UserContext } from "../../context/UserContext";
import { useHistory } from "react-router-dom";
// Socket
import { socket } from "../../service/socket";

export default function RoomAlert() {

  const [open, setOpen] = useState(false);
  const history = useHistory();

  const { user } = useContext(UserContext);

  useEffect(() => {
    setOpen(Boolean(user.currentRoom));
  }, [user])

  const handleReconnect = () => {
    history.push(`/room/${user.currentRoom}`);
    setOpen(false);
  };

  const handleDiscard = () => {
    socket.emit("leaveRoom", { roomId: user.currentRoom, userId: user._id });
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleDiscard}
        aria-labelledby="alert-dialog-room-alert"
        aria-describedby="alert-dialog-description"
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle id="alert-dialog-room-alert">Reconnect to your game</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <h2 style={{textAlign: 'center'}}>Wait!</h2>
            <p>
            It looks like that you have joined room <strong style={{color: '#7C4DFF'}}>{user.currentRoom}</strong> before
            <br />
            Would you like to return to the room
            </p>
          </DialogContentText>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscard} variant="outlined">
            Discard
          </Button>
          <Button onClick={handleReconnect} color="primary" variant="contained">
            Reconnect
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
