const launchesDatabase = require("../models/launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;
const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: "100",
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27,2030"),
  target: "Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

// launches.set(launch.flightNumber, launch);

const existsLaunchWithId = (launchId) => {
  console.log(launches.has(launchId));
  return launches.has(launchId);
};

const getLatestFlightNumber = async () => {
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
};

const getAllLaunches = async () => {
  return await launchesDatabase.find({}, { __id: 0, __v: 0 });
};

const saveLaunch = async (launch) => {
  const planet = await planets.findOne({
    kepler_name: launch.target,
  });

  if (!planet) {
    throw Error("No matching planet is found");
  }

  await launchesDatabase.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
};

saveLaunch(launch);

const addNewLaunch = (launch) => {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ["ZTM", "NASA"],
      flightNumber: latestFlightNumber,
    })
  );
};

const abortLaunchWithId = (launchId) => {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  // console.log(launches.get(100));
  return aborted;
};

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,

  abortLaunchWithId,
};
