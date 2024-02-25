import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const jwtSalt = "pippo";
// per rimanere attivo dopo essermi autenticato ,setto un JWT nel header in una chiamata get
export const auth = (req: Request, res: Response, next: NextFunction) => {// middleware di autenticazione 
  //console.log(req.headers); log degli headers
  try {
    const response = jwt.verify(String(req.headers.token), jwtSalt);//verifico il token e lo salvo nei locals per essere utilizzato dopo nell'autenticazione, se non valido butta un errore
    res.locals.user = response; //salvo nei locals l'oggetto utente   {name: user.name,_id: user._id,email: user.email,}
    next(); // invoco la funzione next
  } catch (err) {
    return res.status(401).json({ message: "You are not auth!" });//se il try dovesse lanciare un errore vuol dire che l'utente non è autenticato
    // solitamente il token viene salvato nell'header, cosi da poter essere controllato nell'endpoint
  }
};