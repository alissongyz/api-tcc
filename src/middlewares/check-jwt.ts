import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const token = <string>req.headers["x-access-token"];
  let jwtPayload : string | any;
  
  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);

    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    return res.status(401).send({
      tokenIsValid: false
    });
  }
 
  //The token is valid for 1 day
  //We want to send a new token on every request 
  const { userId, username } = jwtPayload;
  const newToken = jwt.sign({ userId, username }, process.env.TYPEORM_SECRET, {
    expiresIn: "1d"
  });
  res.setHeader("token", newToken);
  req.headers["x-user"] = username;

  //Call the next middleware or controller
  return next();
};