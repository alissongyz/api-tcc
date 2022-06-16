import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import * as moment from "moment";

import { User } from "../models/User";

class UserController {

  public async getAll(req: Request, res: Response) {
    //Get users from database
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ["username", "role", "dateUpdated", "dateRegister"] //We dont want to send the passwords on response
    });

    //Send the users object
    return res.send(users);
  };

  public async getById(req: Request, res: Response) {
    //Get the ID from the url
    const id: string = req.params.id;

    //Get the user from database
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail({ 
        select:["username", "role", "dateUpdated", "dateRegister"], 
        where: { id: id } 
      });
      return res.status(200).send(user);
    } catch (error) {
      return res.status(404).send("User not found");
    }
  };

  public async createUser(req: Request, res: Response) {
    //Get parameters from the body
    let { username, password, role } = req.body;
    let user: User = null;
    user.username = String(username).trim()
    user.password = password;
    user.role = role;
    user.dateRegister = moment().format('YYYY-MM-DD HH:mm:ss');


    //Try to save. If fails, the username is already in use
    const userRepository = getRepository(User);

    if(await userRepository.findOne({ where: { username }})) {
      return res.status(400).send({
        usernameIsValid: false
      })
    }

    const newUser = await userRepository.save(user);

    //If all ok, send 201 response
    return res.status(201).send(newUser);
  };

  public async updateUser(req: Request, res: Response) {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    const { username, role } = req.body;
    let user: User = null;

    //Try to find user on database
    const userRepository = getRepository(User);

    try {
      user = await userRepository.findOneOrFail({ where: { id: id } });
    } catch (error) {
      //If not found, send a 404 response
      return res.status(404).send("User not found");
    }

    if(username){
      if(await userRepository.findOne({ where: { username }})) {
        return res.status(400).send({
          usernameIsValid: false
        })
      }
    }

    //Temporary validate type string on role
    if(role){
      if(typeof(role) != 'string'){
        return res.status(400).send({
          roleIsValid: false
        });
      }
    }

    //Validate the new values on model
    user.username = String(username).trim();
    user.role = role;
    user.dateUpdated = moment().format('YYYY-MM-DD HH:mm:ss');

    //Try to safe, if fails, that means username already in use
    try {
      await userRepository.save(user);
    } catch (e) {
      return res.status(409).send("username already in use");
    }
    //After all send a 204 (no content, but accepted) response
    return res.status(204).send();
  };

  public async delelteUser(req: Request, res: Response) {
    //Get the ID from the url
    const id = req.params.id;

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { id: id } });
    } catch (error) {
      return res.status(404).send("User not found");
    }
    userRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    return res.status(204).send();
  };
};

export default new UserController();