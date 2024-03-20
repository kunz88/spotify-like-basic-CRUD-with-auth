import express, { Request, Response } from "express";
import { param, matchedData} from "express-validator";
import { Song } from "../models/Song";

const router = express.Router(); // istanzio il router( la nostra mini app delle route)
router.get(
  "/",
  param("name").trim().escape(),
  async (_: Request, res: Response) => {
    const songs = await Song.find({})
    if (!songs) {
      return res.status(404).json({ message: "Songs not found" });
    }
    console.log(songs)
    const artists = songs.map(item => {
      return {artist:item.artist,image:item.pictureUrl}
      
    }) // uso map per inviare solo gli artisti
    res.json(artists);
  }
);
router.get(
    "/:name",
    param("name").trim().escape(),
    async (req: Request, res: Response) => {
      const songs = await Song.find({artist:req.params.name})
      if (!songs) {
        return res.status(404).json({ message: "Songs not found" });
      }
      res.json(songs);
    }
  );

  export default router;