import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";

import { User } from "../models/User";
import config from "../config/config";

class AuthController {
  public async login(req: Request, res: Response) {
    //Check if username and password are set
    let { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send({
        error: "Campos obrigatórios."
      });
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      return res.status(401).send({
        userIsValid: false
      });
    }

    //if the password the user entered matches your password, return the token, otherwise return an error
    if (password === user.password) {
      //Sing JWT, valid for 1 day
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        config.jwtSecret,
        { expiresIn: "1d" }
      );

      let objectToResponse = {
        username
      }

      //Send the jwt in the response
      return res.send({ token, objectToResponse });
    } else {
      return res.status(400).send({
        passwordIsValid: false
      });
    }
  };

  public async changePassword(req: Request, res: Response) {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).send({
        error: "Campos obrigatórios."
      });
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { id } });
    } catch (id) {
      return res.status(401).send({
        userIsValid: false
      });
    }

    //if the old password is the same as the current password, save the data, otherwise return an error
    if (oldPassword === user.password) {
      user.password = newPassword;
      userRepository.save(user);

      return res.status(200).send({
        updatedPasword: true
      });
    } else {
      return res.status(400).send({
        oldPasswordIsValid: false
      });
    }
  };
}
export default new AuthController();