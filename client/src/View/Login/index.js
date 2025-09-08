import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Grow,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useCookies } from "react-cookie";
import Logo from "../../Asset/img/reversi-logo-01.svg";
import { useHistory } from "react-router-dom";
import "../../Asset/loading.css";
import GitHubIcon from "@material-ui/icons/GitHub";

// Login Controller
import login from "../../controller/user/login";

const useStyle = makeStyles({
  inputForm: {
    width: "500px",
    padding: "40px",
  },
});

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const classes = useStyle();

  const [cookies, setCookie] = useCookies(["_user"]);
  const history = useHistory();

  const isNewAccount = (message) => {
    return message === "Email Not Found";
  };

  const setupRegister = () => {
    window.localStorage.setItem("_account", username);
    window.localStorage.setItem("_password", password);
    history.push(`/register?email=${username}`);
  };

  const onClickStart = () => {
    setLoading(true);
    const loginRequest = async () => {
      const res = await login(username, password);
      if (res.data.token) {
        window.localStorage.setItem("_user", JSON.stringify(res.data.user));
        setCookie("_userId", res.data.user._id, {
          expires: new Date(Date.now() + 86400 * 1000),
        });
        setCookie("_token", res.data.token, {
          expires: new Date(Date.now() + 86400 * 1000),
        });
        history.push("/");
      } else {
        isNewAccount(res.data.message)
          ? setupRegister()
          : setError(res.data.message);
      }
      setLoading(false);
    };
    loginRequest();
  };

  /**
   * Listener for Enter Pressing
   */
  const onEnterPressed = (e) => {
    if (e.key === "Enter") onClickStart();
  };

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt="100px">
        <img src={Logo} style={{ height: "150px" }}></img>
      </Box>
      <Box display="flex" justifyContent="center">
        <Typography>Compete. Have Fun.</Typography>
      </Box>
      <Grow in={true}>
        <Box display="flex" justifyContent="center" mt="50px">
          <Paper elevation={3}>
            <Grid
              container
              direction="column"
              className={classes.inputForm}
              spacing={3}
            >
              <Grid item xs>
                <TextField
                  variant="outlined"
                  label="Your Email"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  variant="outlined"
                  label="Your Password"
                  fullWidth
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => onEnterPressed(e)}
                />
              </Grid>
              {error && (
                <Grid item xs>
                  <Typography
                    variant="body2"
                    style={{ color: "red" }}
                    align="right"
                  >
                    {error}
                  </Typography>
                </Grid>
              )}
              <Grid item xs>
                {loading ? (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disableRipple
                  >
                    <div style={{ padding: "11px" }}>
                      <div class="dot-windmill" />
                    </div>
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={onClickStart}
                  >
                    Start
                  </Button>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Grow>
      <Box display="flex" justifyContent="center" mt="50px">
        Server Status:{" "}
        <span style={{ color: "green", marginLeft: "10px" }}>Online 🟢 </span>
      </Box>
      <Box display="flex" justifyContent="center" mt="20px">
        <Button
          variant="text"
          disableElevation
          disableRipple
          onClick={() => window.location.href = "https://github.com/yulonghe97"}
        >
          <GitHubIcon />
        </Button>
      </Box>
    </Container>
  );
}
