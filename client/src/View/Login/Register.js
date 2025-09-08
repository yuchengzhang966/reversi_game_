import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Grid,
  Typography,
  Button,
  Grow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Logo from "../../Asset/img/reversi-logo-01.svg";
import EditableLabel from "react-inline-editing";
import RandomAvatar from "./RandomAvatar";
import UserLoginRegContext from "./store/context";
import { useCookies } from 'react-cookie';
import { useHistory } from "react-router-dom";
import login from "../../controller/user/login";

// Register Controller
import register from "../../controller/user/register";

const useStyle = makeStyles((theme) => ({
  text: {},
  inputForm: {
    width: "600px",
    padding: "40px",
  },
  avatar: {
    marginTop: theme.spacing(5),
  },
}));

export default function RegisterPage() {
  const classes = useStyle();
  const [nickname, setNickname] = useState("Your Nickname");
  const [valid, setValid] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [cookies, setCookie] = useCookies(['_user']);
  const history = useHistory();

  const validateNickname = () => {
    if (
      nickname !== "Your Nickname" &&
      nickname !== "" &&
      nickname !== " " &&
      nickname.length >= 6 &&
      nickname.length <= 15
    ) {
      setError("");
      return true;
    } else {
      setError("At least 6 or maximum 14 letters");
      return false;
    }
  };

  useEffect(() => {
    if (nickname !== "Your Nickname") {
      setValid(validateNickname());
    }
  }, [nickname]);

  useEffect(() => {
    const isSetAccountPassowrd = () => {
      return (
        Boolean(window.localStorage.getItem("_account")) &&
        Boolean(window.localStorage.getItem("_password"))
      );
    };
    if (!isSetAccountPassowrd()) history.push("/login");
  }, []);

  /**
   * Automatically Login after the registration
   */
  const onLogin = async (username, password) => {
    const res = await login(username, password);
    console.log(res);
    if (res.data.token) {
      window.localStorage.setItem("_user", JSON.stringify(res.data.user));
      setCookie("_userId", res.data.user._id);
      setCookie("_token", res.data.token);
      history.push('/');
    } else {
      setError(res.data.message);
    }
  };

  const onClick = async () => {
    
    const [account, password] = [window.localStorage.getItem("_account"), window.localStorage.getItem("_password")];

    setLoading(true);
    const res = await register(
      account,
      password,
      nickname,
      avatar
    );
    if (res.data.success) {
      onLogin(account, password);
    } else {
      setError(res.data.message);
      setLoading(false);
    }
  };

  return (
    <UserLoginRegContext.Provider value={{ avatar, setAvatar }}>
      <Container>
        <Box display="flex" justifyContent="center" mt="100px">
          <img src={Logo} style={{ height: "150px" }}></img>
        </Box>
        <Grow in={true}>
          <Box display="flex" justifyContent="center" mt="50px">
            <Grid
              container
              direction="column"
              className={classes.inputForm}
              spacing={3}
              justifyContent="center"
              alignContent="center"
            >
              <Paper
                style={{
                  padding: "50px",
                  paddingLeft: "120px",
                  paddingRight: "120px",
                }}
                elevation={3}
              >
                <Grid item xs={12}>
                  <Typography color="primary" variant="h4">
                    New Player
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Box my="20px">
                    <RandomAvatar />
                  </Box>
                </Grid>
                <Grid item xs>
                  <Box display="flex" justifyContent="center" mt="20px">
                    <Typography variant="subtitle1" align="center">
                      <EditableLabel
                        text={nickname}
                        inputPlaceHolder="Your Nickname"
                        labelClassName="myLabelClass"
                        inputClassName="myInputClass"
                        inputWidth="200px"
                        inputHeight="25px"
                        inputMaxLength="50"
                        onFocusOut={(text) => setNickname(text)}
                      />
                    </Typography>
                  </Box>
                </Grid>
                {error && (
                  <Grid item xs>
                    <Typography
                      align="end"
                      variant="body2"
                      style={{ color: "red" }}
                    >
                      {error}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs>
                  <Box display="flex" justifyContent="center" mt="20px">
                    {loading ? (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disableRipple
                      >
                        <div style={{ padding: "10px" }}>
                          <div class="dot-windmill" />
                        </div>
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        variant="contained"
                        disabled={!valid}
                        onClick={onClick}
                      >
                        Start Playing
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Paper>
            </Grid>
          </Box>
        </Grow>
      </Container>
    </UserLoginRegContext.Provider>
  );
}
