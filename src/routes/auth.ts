import express, { Request, Response} from "express";
const app = express.Router();
import { body, param, matchedData } from "express-validator";
import { User} from "../models/User";
import { checkValidation } from "../middlewares/validations";
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from 'uuid'
import jwt from "jsonwebtoken";
import { auth, jwtSalt } from "../middlewares/auth";

import { saltRounds } from "../app";






app.get("/me", auth, (req: Request, res: Response) => {// in questo endpoint si suppone che l'utente sia già loggato, si controlla tramite 
    // il middleware "auth" che sia il token sia salvato nell'header delle richiesta, così da validare la richiesta http dell'utente e inviare una risposta
    res.json({ message: `Hello ${res.locals.user.name}` });// tramite il middleware si salvano nei locals i dati dell'utente, poi vengono mandati a schermo
});

app.post( // end poin di signup
    "/signup",
    body("name").notEmpty().trim(),// catena dei middleware
    body("email").notEmpty().trim().isEmail(),// nel middleware customSanitazier cripto la password attraverso il metodo hashSync
    body("password").notEmpty().trim().isStrongPassword().customSanitizer(password => bcrypt.hashSync(password, saltRounds)),// utilizzo il sale
    body("avatar").isURL().optional(),
    checkValidation,// middelware per controllare la validazione
    async (req: Request, res: Response) => {
        try {
            const user = new User(matchedData(req));// creo un utente con tutti gli attributi matchati
            user.confirmedUuid = uuidv4()// creo un uuid di conferma da utilizzare nella mai di validazione successivamente
            const userCreated = await user.save();// salvo l'utente nel database
            res.status(201).json({ // invio la risposta con alcuni attributi dell'utente creato
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

app.get( // route di validazione della mail dell'utente
    "/emailValidation/:uuid", // se l'utente clicca la mail farà una semplice chiamata get
    param("uuid").isUUID(), // uuid personale dell'utente
    checkValidation,
    async (req: Request, res: Response) => {
        const user = await User.findOne({ confirmedUuid:req.params.uuid }); // controllo se esiste un utente con la uuid matchata dai params
        if (!user) {// se non trovo un utente invio un errore 404
            return res.status(404).json({ message: "User not found" });
        }
        user.confirmedMail = true; // se trovo l'utente modifico il booleano per la conferma della mai
        user.confirmedUuid = undefined;// setto la uuid a undefined ,eliminando la chiave confirmedUuid
        await user.save();// salvo l'utente nel database
        res.json({ message: "Validazione email eseguita con successo" }); // invio un messaggio di validazione avvenuta
    }
);

app.post(
    "/login",// end point per la login dell'utente
    body("email").notEmpty().trim().isEmail(), // validazione mail
    body("password").notEmpty().trim().isStrongPassword(),// prima validazione password
    checkValidation,
    async (req: Request, res: Response) => {
        const body = matchedData(req);// creo una variabile body con i parametri matchati
        const user = await User.findOne({ // cerco un utante tramite mail e controllo se ha già confermato l'email
            email: body.email,
            confirmedMail: true
        });
        if (!user || !bcrypt.compareSync(req.body.password, user.password!)) { // se non trovo nessun utente oppure la password è errata 
            return res.status(401).json({ message: "Invalid credentials" });// invio un errore 401 non autorizzato
        }
        res.json({// se l'utente e password sono corretti invio in jason web token che l'utente si salverà in cash per irmanere loggato
            token: jwt.sign(// la funzione sign prende in ingresso due parametri un oggetto ed un chiave
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

export default app;