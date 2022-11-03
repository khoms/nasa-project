const axios = require("axios");

const launchesDatabase = require("../models/launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

let latestFlightNumber = 100;

const launch = {
  flightNumber: "100", //flight_number
  mission: "Kepler Exploration X", //number
  rocket: "Explorer IS1", //rocket.name
  launchDate: new Date("December 27,2030"), //date_local
  target: "Kepler-442 b", //not applicable
  customer: ["ZTM", "NASA"], //payload.customerss
  upcoming: true, //upcoming
  success: true, //success
};

saveLaunch(launch);

// launches.set(launch.flightNumber, launch);

const loadLaunchesData = async () => {
  const SPACE_API_URL = "https://api.spacexdata.com/v4/launches/query";
  console.log("Downloading launch Data....");
  const response = await axios.post(SPACE_API_URL, {
    query: {},
    options: {
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
};

const existsLaunchWithId = async (launchId) => {
  return launchesDatabase.findOne({
    flightNumber: launchId,
  });
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

  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
};

const scheduleLaunch = async (launch) => {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
};
// const addNewLaunch = (launch) => {
//   latestFlightNumber++;
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       success: true,
//       upcoming: true,
//       customers: ["ZTM", "NASA"],
//       flightNumber: latestFlightNumber,
//     })
//   );
// };

const abortLaunchWithId = async (launchId) => {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  // console.log(aborted);
  return aborted.matchedCount === 1 && aborted.modifiedCount === 1;
  // return await launchesDatabase.updateOne(
  //   {
  //     flightNumber: launchId,
  //   },
  //   {
  //     $set: {
  //       upcoming: false,
  //       success: false,
  //     },
  //   }
  // );
};

module.exports = {
  loadLaunchesData,
  existsLaunchWithId,
  getAllLaunches,
  // addNewLaunch,
  scheduleLaunch,
  abortLaunchWithId,
};
