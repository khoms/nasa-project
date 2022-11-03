const express = require("express");

const launchesRouter = require("./launches.route");
const planetsRouter = require("./planets.router");

const apiVersion = express.Router();

apiVersion.use("/planets", planetsRouter);
apiVersion.use("/launches", launchesRouter);

module.exports = apiVersion;
