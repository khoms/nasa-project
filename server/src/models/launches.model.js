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

launches.set(launch.flightNumber, launch);

const existsLaunchWithId = (launchId) => {
  console.log(launches.has(launchId));
  return launches.has(launchId);
};

const getAllLaunches = () => {
  return Array.from(launches.values());
};

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
