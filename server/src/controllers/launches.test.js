const request = require("supertest");
const app = require("../app");
const { connectDB, disconnectDB } = require("../db");
const { loadLaunchesData } = require("../models/launches.model");

describe("Test launches Api", () => {
  beforeAll(async () => {
    await connectDB();
    await loadLaunchesData();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe("Test GEt /v1/launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app).get("/launches").expect(200);
      // expect(response.statusCode).toBe(200);
    });
  });

  describe("Test POST /launch", () => {
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "January 4, 2028",
    };
    const launchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
    };

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });
  });
});
