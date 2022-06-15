import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../models/User";

class UserController{

public async getAll(req: Request, res: Response) {
  //Get users from database
  const userRepository = getRepository(User);
  const users = await userRepository.find({
    select: ["username", "role"] //We dont want to send the passwords on response
  });

  //Send the users object
  res.send(users);
};

public async getById(req: Request, res: Response) {
  //Get the ID from the url
  const id: string = req.params.id;

  //Get the user from database
  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOneOrFail({ where: {id: id }});
  } catch (error) {
    res.status(404).send("User not found");
  }
};

public async createUser(req: Request, res: Response) {
  //Get parameters from the body
  let { username, password, role } = req.body;
  let user = new User();
  user.username = username;
  user.password = password;
  user.role = role;

  //Validade if the parameters are ok
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  //Try to save. If fails, the username is already in use
  const userRepository = getRepository(User);

  const newUser = await userRepository.save(user);

  //If all ok, send 201 response
  return res.status(201).send(newUser);
};

public async updateUser(req: Request, res: Response) {
  //Get the ID from the url
  const id = req.params.id;

  //Get values from the body
  const { username, role } = req.body;

  //Try to find user on database
  const userRepository = getRepository(User);
  let user;
  try {
    user = await userRepository.findOneOrFail({ where: {id: id }});
  } catch (error) {
    //If not found, send a 404 response
    res.status(404).send("User not found");
    return;
  }

  //Validate the new values on model
  user.username = username;
  user.role = role;
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  //Try to safe, if fails, that means username already in use
  try {
    await userRepository.save(user);
  } catch (e) {
    res.status(409).send("username already in use");
    return;
  }
  //After all send a 204 (no content, but accepted) response
  res.status(204).send();
};

public async delelteUser(req: Request, res: Response) {
  //Get the ID from the url
  const id = req.params.id;

  const userRepository = getRepository(User);
  let user: User;
  try {
    user = await userRepository.findOneOrFail({ where: {id: id }});
  } catch (error) {
    res.status(404).send("User not found");
    return;
  }
  userRepository.delete(id);

  //After all send a 204 (no content, but accepted) response
  res.status(204).send();
};
};

export default new UserController();