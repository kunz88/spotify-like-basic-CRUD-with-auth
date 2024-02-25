import request from "supertest";
import app, { connection } from "../app";
import * as assert from "assert";
import { Song } from "../models/Song";
import { v4 as uuidv4 } from "uuid";

describe("Songs Get/:id request", () => {
  before(async () => {
    await connection;
  });
  after(async () => {
    if (String(process.env.NODE_ENV).trim() === "test") {
      // controllo sul NODE_ENV che sto utilizzando
      await Song.deleteMany(); //elimino tutti gli utenti dal database ogni volta che finisco i test
    }
  });
  it("Status is running 200", async () => {
    const { status } = await request(app).get("/status");
    assert.equal(status, 200);
  });
  it("Get /songs/:id  400 wrong mongoId", async () => {
    const invalidId = 1234;
    const { status } = await request(app).get(`/songs/${invalidId}`);
    assert.equal(status, 400);
  });
  it("Get /songs/:id  404 right mongoId but songs not in the database", async () => {
    const validMongoId = "65cc7f6647ffb90714d2a064";
    const { status } = await request(app).get(`/songs/${validMongoId}`);
    assert.equal(status, 404);
  });
  it("Get /songs/:id  200 right mongoId", async () => {
    await Song.create({
      title: "Imagine",
      text: "Imagine there's no heaven. It's easy if you try...",
      duration: 187,
      pictureUrl: "https://example.com/imagine.jpg",
      musicalGenre: "Pop",
      artist: "John Lennon",
    });

    const songs = await Song.findOne({ title: "Imagine" });
    const { status } = await request(app).get(`/songs/${songs!._id}`);
    assert.equal(status, 200);
  });
});

describe("Songs Post/ request", () => {
  before(async () => {
    await connection;
  });
  after(async () => {
    if (String(process.env.NODE_ENV).trim() === "test") {
      // controllo sul NODE_ENV che sto utilizzando
      await Song.deleteMany(); //elimino tutti gli utenti dal database ogni volta che finisco i test
    }
  });
  it("Post /songs/ 400 missing title key", async () => {
    const { status } = await request(app).post("/songs/").send({
      text: "Imagine there's no heaven. It's easy if you try...",
      duration: 187,
      pictureUrl: "https://example.com/imagine.jpg",
      musicalGenre: "Pop",
      artist: "John Lennon",
    });
    assert.equal(status, 400);
  });
  it("Post /songs/ 400 missing artist key", async () => {
    const { status } = await request(app).post("/songs/").send({
      title: "Imagine",
      text: "Imagine there's no heaven. It's easy if you try...",
      duration: 187,
      pictureUrl: "https://example.com/imagine.jpg",
      musicalGenre: "Pop",
    });
    assert.equal(status, 400);
  });
  it("Post /songs/ 401 not auth", async () => {
    const { status } = await request(app).post("/songs/").send({
      title: "Imagine",
      text: "Imagine there's no heaven. It's easy if you try...",
      duration: 187,
      pictureUrl: "https://example.com/imagine.jpg",
      musicalGenre: "Pop",
      artist: "John Lennon",
    });
    assert.equal(status, 401);
  });
});
