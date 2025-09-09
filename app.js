// Setup Express
const express = require("./node_modules/express");
const app = express();
const http = require("http");
const cors = require('cors')
const schedule = require('node-schedule');

// Setup Socket.IO, bind to Express
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);
const initListeners = require("./Socket/listeners");

// Other Utilities
const log = require("./utils/log");
const dotenv = require("dotenv");

// Mongoose
const mongoose = require("mongoose");

// Routers
const gameCoreRouter = require("./routes/game/gameApi");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const roomRoute = require("./routes/rooms/index");
const userRoute = require("./routes/user/index");


//const { RedisClient } = require("redis");
// Redis
const redis = require("redis");
const RedisClient = redis.createClient({ url: process.env.REDIS_CONNECT_URL });
RedisClient.on("error", function(error) {
  console.error(error);
});

dotenv.config();

// CORS Configuration
// This tells your backend which frontend domains are allowed to make requests.
// We use an environment variable for the production URL to keep it flexible.
const allowedOrigins = ['http://localhost:3000'];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
  // If your frontend gets a www subdomain, you might want to allow that too
  allowedOrigins.push(process.env.FRONTEND_URL.replace('://', '://www.'));
}

const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Format the JSON Response
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("json spaces", 2);

// Setup Routers
app.use("/game", gameCoreRouter);
app.use("/api/user", authRoute);
app.use("/api/post", postRoute);
app.use("/api/room", roomRoute);
app.use("/api/userinfo", userRoute);


// Initialize Socket IO Listeners
initListeners(io);
require('./scheduledWorks/checkRooms')(schedule, io);


app.get("/", (req, res) => {
  res.json({ message: "Welcome to PlayReversi API" });
});

// Connect to Databse
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => log("CONNECTED TO DATABASE", "success")
);
mongoose.set('useFindAndModify', false);


// API Server Initialization
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  log(`Server listening on port ${PORT}`, "success");
});
