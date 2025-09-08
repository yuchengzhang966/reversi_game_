import * as React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import GamePlayPage from "./View/Game/GamePlayPage";
import LoginPage from "./View/Login";
import RegisterPage from "./View/Login/Register";
import RoomPage from "./View/Room/RoomList";
import CreateRoomPage from "./View/Room/WaitingRoom";
import { isLoggedIn } from "./utils/checkAuth";
import { useCookies } from "react-cookie";

// Context
import { UserProvider } from "./context/UserContext";
import { GameProvider } from "./context/GameContext";
import { MessageProvider } from "./context/MessageContext";

/**
 * PrivateRoute only allows user who signed in to access to route
 */
const PrivateRoute = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (isLoggedIn() ? children : <Redirect to="/login" />)}
    />
  );
};

/**
 * Auth Route is used for registration
 */

const AuthRoute = ({ component: Component, ...rest }) => {
  const [cookies] = useCookies(["_token"]);

  return (
    <Route
      {...rest}
      render={({ location, props }) =>
        cookies._token ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default class Routes extends React.Component {
  render() {
    return (
      <MessageProvider>
      <BrowserRouter>
        <Switch>
          <PrivateRoute exact path="/">
            <UserProvider>
              <RoomPage />
            </UserProvider>
          </PrivateRoute>
          <PrivateRoute exact path="/game/:id">
            <UserProvider>
              <GameProvider>
                <GamePlayPage />
              </GameProvider>
            </UserProvider>
          </PrivateRoute>
          <PrivateRoute exact path="/room/:id">
            <UserProvider>
              <GameProvider>
                <CreateRoomPage />
              </GameProvider>
            </UserProvider>
          </PrivateRoute>
          <AuthRoute exact path="/login" component={LoginPage} />
          <AuthRoute exact path="/register" component={RegisterPage} />
          <PrivateRoute exact path="/room">
            <RoomPage />
          </PrivateRoute>
        </Switch>
      </BrowserRouter>
      </MessageProvider>
    );
  }
}
