const http = require("http");

const { loadPlanetsData } = require("./models/planets.model");

const app = require("./app");
const { connectDB } = require("./db");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
// connectDB();
const runServer = async () => {
  connectDB();

  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

runServer();
