import express, { Request, Response} from "express";
import { connect } from 'mongoose';
import path from 'path'
import songs from './routes/songs'
import auth from "./routes/auth";
import artists from "./routes/artists"

require("dotenv").config({// configura il path di ricerca del file .env.* utilizzando la variabile ambiantale NODE_ENV
    path: path.join(__dirname,`../.env.${process.env.NODE_ENV}`.trim()),// conviene togliere gli spazi per evitare problemi con la ricerca del file
  });

export const saltRounds= Number(process.env.SALT_BCRYPT);// sale per hashing

const app = express() // avvio l'app
export const connection = connect(process.env.MONGODB!)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(`Couldn't connect to MongoDB: ${err}`);
  });

  
app.listen(3000,async ()=> {// la faccio connettere al porta 3000
    console.log("App is listening on port 3000")

})
app.get("/status", (_: Request, res: Response) => {
  res.json({ message: "Server is running!" });
});
app.use(express.json());
app.use("/songs", songs);// uso la route song
app.use("/auth", auth);// uso la route auth
app.use("/artists", artists);// uso la route auth
export default app;