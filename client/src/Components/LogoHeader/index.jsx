import React from "react";
import { Box } from "@material-ui/core";
import Logo from "../../Asset/img/reversi-logo-01.svg";

export default function LogoHeader() {
  return (
    <div>
      <Box display="flex" justifyContent="center">
        <img src={Logo} style={{ height: "150px" }}></img>
      </Box>
    </div>
  );
}
