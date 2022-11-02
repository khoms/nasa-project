const {
  getAllLaunches,
  scheduleLaunch,
  existsLaunchWithId,
  abortLaunchWithId,
} = require("../models/launches.model");

const httpGetAllLaunches = async (req, res) => {
  return res.status(200).json(await getAllLaunches());
};

const httpAddNewLaunch = async (req, res) => {
  const launch = req.body;

  launch.launchDate = new Date(launch.launchDate);

  await scheduleLaunch(launch);
  res.status(201).json(launch);
};

const httpAbortLaunch = async (req, res) => {
  const launchId = req.params.id;

  const existsLaunch = await existsLaunchWithId(launchId);
  //if launch doesnt exist
  if (!existsLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = await abortLaunchWithId(launchId);

  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }
  //if launch does exist
  return res.status(200).json({
    ok: true,
  });
};

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
