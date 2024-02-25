import express, { Request, Response } from "express";
import { body, param, matchedData, query } from "express-validator";
import { Song } from "../models/Song";
import { checkValidation } from "../middlewares/validations";
import { auth } from "../middlewares/auth";
const router = express.Router(); // istanzio il router( la nostra mini app delle route)

// primo endpoin
router.get("/",
query("text").trim().escape(),
async (req: Request, res: Response) => {
  const { text } = matchedData(req);
  if(!text){
    const songs = await Song.find();
    return res.json(songs);
  }
  console.log(text)
  const songs = await Song.find({text:{$regex:text}});
  return res.json(songs);
});


// secondo end point
router.get(
  "/:id",
  param("id").isMongoId(),
  checkValidation,
  async (req: Request, res: Response) => {
    const { id } = matchedData(req);
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.json(song);
  }
);



// terzo endpont
router.post(
  "/",
  body("title").notEmpty().trim(),
  body("text").optional().trim(),
  body("duration").notEmpty().isInt({ min: 0, max: 2000 }).toInt(),
  body("pictureUrl").optional().isURL().trim(),
  body("artist").notEmpty().trim(),
  body("musicalGenre").optional().trim(),
  checkValidation,
  auth,
  async (req: Request, res: Response) => {
    try {
      const song = new Song(matchedData(req));
      const songCreated = await song.save();
      res.json(songCreated);
    } catch (err) {
      res.status(409).json(err);
    }
  }
);

// quarto end point
router.put(
  "/:id",
  param("id").isMongoId(),
  body("title").optional().trim(),
  body("text").optional().trim(),
  body("duration").optional().isInt({ min: 0, max: 2000 }).toInt(),
  body("pictureUrl").optional().isURL().trim(),
  body("artist").optional().trim(),
  body("musicalGenre").optional().trim(),
  checkValidation,
  auth,
  async (req: Request, res: Response) => {
    await Song.findByIdAndUpdate(req.params.id, matchedData(req));
    const user = await Song.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  }
);
router.delete(
  "/:id",
  param("id").isMongoId(),
  checkValidation,
  auth,
  async (req: Request, res: Response) => {
    const { id } = matchedData(req);
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      await Song.findByIdAndDelete(id);
      return res.json({
        message: `Song deleted`,
        deleteSong: song,
      });
    }
  }
);

export default router;
