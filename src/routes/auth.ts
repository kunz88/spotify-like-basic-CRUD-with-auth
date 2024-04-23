import express, { Request, Response } from "express";
const app = express.Router();
import { body, param, matchedData } from "express-validator";
import { User } from "../models/User";
import { checkValidation } from "../middlewares/validations";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { auth, jwtSalt } from "../middlewares/auth";
import request from "request";

import { saltRounds } from "../app";
var spotifyClientId = '8aa3c4fa0b5541b8abe418f87b9c08cd'; // TODO fix env undefined bug
var spotifyClientSecret = '6cdddd22938a421c9c537d06e6d60b36';
var token = ""


const generateRandomString = function (length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.get("/me", auth, (req: Request, res: Response) => {
  // in questo endpoint si suppone che l'utente sia già loggato, si controlla tramite
  // il middleware "auth" che sia il token sia salvato nell'header delle richiesta, così da validare la richiesta http dell'utente e inviare una risposta
  res.json({ user: res.locals.user.name }); // tramite il middleware si salvano nei locals i dati dell'utente, poi vengono mandati a schermo
});

app.post(
  // end poin di signup
  "/signup",
  body("name").notEmpty().trim(), // catena dei middleware
  body("email").notEmpty().trim().isEmail(), // nel middleware customSanitazier cripto la password attraverso il metodo hashSync
  body("password")
    .notEmpty()
    .trim()
    .isStrongPassword()
    .customSanitizer((password) => bcrypt.hashSync(password, saltRounds)), // utilizzo il sale
  body("avatar").isURL().optional(),
  checkValidation, // middelware per controllare la validazione
  async (req: Request, res: Response) => {
    try {
      const user = new User(matchedData(req)); // creo un utente con tutti gli attributi matchati
      console.log(user);
      user.confirmedUuid = uuidv4(); // creo un uuid di conferma da utilizzare nella mai di validazione successivamente
      const userCreated = await user.save(); // salvo l'utente nel database
      res.status(201).json({
        // invio la risposta con alcuni attributi dell'utente creato
        name: userCreated.name,
        _id: userCreated._id,
        email: userCreated.email,
      });
      //console.log(// faccio finta di inviare una mail di validazione della mail,  la route sarà /auth/emailValidation/uuid personale dell'utente
      //`ti mando una mail con un link a http://locahost:3000/auth/emailValidation/${user.confirmedUuid}`
      //);
    } catch (err) {
      res.status(409).json(err);
    }
  }
);

app.get(
  // route di validazione della mail dell'utente
  "/emailValidation/:uuid", // se l'utente clicca la mail farà una semplice chiamata get
  param("uuid").isUUID(), // uuid personale dell'utente
  checkValidation,
  async (req: Request, res: Response) => {
    const user = await User.findOne({ confirmedUuid: req.params.uuid }); // controllo se esiste un utente con la uuid matchata dai params
    if (!user) {
      // se non trovo un utente invio un errore 404
      return res.status(404).json({ message: "User not found" });
    }
    user.confirmedMail = true; // se trovo l'utente modifico il booleano per la conferma della mai
    user.confirmedUuid = undefined; // setto la uuid a undefined ,eliminando la chiave confirmedUuid
    await user.save(); // salvo l'utente nel database
    res.json({ message: "Validazione email eseguita con successo" }); // invio un messaggio di validazione avvenuta
  }
);

app.post(
  "/login", // end point per la login dell'utente
  body("email").notEmpty().trim().isEmail(), // validazione mail
  body("password").notEmpty().trim().isStrongPassword(), // prima validazione password
  checkValidation,
  async (req: Request, res: Response) => {
    const body = matchedData(req); // creo una variabile body con i parametri matchati
    const user = await User.findOne({
      // cerco un utante tramite mail e controllo se ha già confermato l'email
      email: body.email,
      confirmedMail: true,
    });
    if (!user || !bcrypt.compareSync(req.body.password, user.password!)) {
      // se non trovo nessun utente oppure la password è errata
      return res.status(401).json({ message: "Invalid credentials" }); // invio un errore 401 non autorizzato
    }
    res.json({

      user:{
        name: user.name,
        email: user.email,
        avatar:user.avatar,

      },

      // se l'utente e password sono corretti invio in json web token che l'utente si salverà in cash per irmanere loggato
      token: jwt.sign(
        // la funzione sign prende in ingresso due parametri un oggetto ed un chiave
        // l'oggetto passato verrà trasformato in una stringa che potrà essere riconvertita in futuro tramite la funzione verify e la stessa chiave

        {
          name: user.name,
          _id: user._id,
          email: user.email,
        },
        jwtSalt
      ),
    });
  }
);

app.get("/login", (req: Request, res: Response) => {
  const scope =
    "streaming user-read-email user-read-private";
  const state = generateRandomString(16);

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id:spotifyClientId,
    scope: scope,
    redirect_uri:"http://localhost:3000/auth/callback",
    state: state,
  });
  res.redirect(
    `https://accounts.spotify.com/authorize/?${auth_query_parameters}`
      
  );
});

app.get("/callback", (req: Request, res: Response) => {
  var code = req.query.code;

  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: "http://localhost:3000/auth/callback",
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(spotifyClientId + ":" + spotifyClientSecret).toString(
          "base64"
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };
  // faccio la richiesta all'api di spotify per il token
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      token = body.access_token;
      res.redirect('http://localhost:5173/')

      
    }
  });
  app.get('/token', (req, res:Response) => {
    res.json(
       {
          spotifyToken: token
       })
  })
});
export default app;
