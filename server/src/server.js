const http = require("http");

require("dotenv").config();

const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");

const app = require("./app");
const { connectDB } = require("./db");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
// connectDB();
const runServer = async () => {
  await connectDB();

  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

runServer();
