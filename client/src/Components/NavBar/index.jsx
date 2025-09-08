import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import { Box } from "@material-ui/core";
import { delete_cookie } from "../../utils/cookie";
import { userLogoutModel } from "../../model/user/";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 0,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  button:{
    paddingTop:'5px',
    "&:hover":{
      color: '#7C4DFF',
      cursor: 'pointer',  
    }
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  const onLogout = async () => {
    // Logout user in server-side;
    await userLogoutModel();
    delete_cookie("_token");
    window.location.href = "/login";
  }

  return (
    <>
      <Box display="flex" justifyContent="flex-end" padding="20px">
        <Typography variant="h6" className={classes.button}>
          <span onClick={onLogout}>Logout</span>
        </Typography>
      </Box>
    </>
  );
}
