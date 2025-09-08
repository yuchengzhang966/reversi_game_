import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Box, Typography } from "@material-ui/core";

// Controller API
import getUserLeaderBoard from "../../controller/user/getLeaderBoard";

const useStyles = makeStyles({
  table: {
    // minWidth: 650,
  },
  tableHead: {
    backgroundColor: "#7C4DFF",
  },
  whiteFont: {
    color: "#ffffff",
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function LeaderBoard() {
  const classes = useStyles();

  const [leaderBoard, setLeaderBoard] = useState([]);

  useEffect(() => {
    async function getLeaderBoard() {
      const res = await getUserLeaderBoard("10");
      res.data ? setLeaderBoard(res.data.data) : console.error(res.message);
    }
    getLeaderBoard();
  }, []);

  return (
    <>
      <Box textAlign="center" mb="10px">
        <Typography variant="subtitle1">{"🥇 LeaderBoard 🥇"}</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell className={classes.whiteFont} align="center">Rank</TableCell>
              <TableCell className={classes.whiteFont} align="center">
                Name
              </TableCell>
              <TableCell className={classes.whiteFont} align="center">
                Score
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderBoard.length > 0 ? (
              <>
                {leaderBoard.map((user, index) => (
                  <TableRow key={user.name}>
                    <TableCell component="th" scope="row" align="center">
                      {index + 1}
                    </TableCell>
                    <TableCell align="right" align="center">{user.name}</TableCell>
                    <TableCell align="right" align="center">{user.score}</TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <Box display="flex" justifyContent="center">
                Loading LeaderBoard...
              </Box>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
