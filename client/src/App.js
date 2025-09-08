import React, { useState, useEffect } from "react";
import Routes from "./routes";
import "./Asset/loading.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { CookiesProvider } from 'react-cookie';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#7c4dff",
      errorColor: "#e33371",
    },
    secondary: {
      main: "#4dff7c",
    },
  },
  typography: {
    fontFamily: [
      "futura",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

function App() {
  const [response, setResponse] = useState("");

  useEffect(() => {}, []);

  return (
    <>
      <ThemeProvider theme={theme}>
      <CookiesProvider>
        {/* <NavBar /> */}
        <Routes />
        </CookiesProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
