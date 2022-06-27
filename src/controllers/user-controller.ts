import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as moment from "moment";

import { User, UserRole } from "../models/User";

class UserController {

  public async getAll(req: Request, res: Response) {
    //Get users from database
    const builder = getRepository(User).createQueryBuilder('user');

    // Aplicando Filtros no GET ALL
    if (req.query.username) {
      builder.where("user.username LIKE :username", { username: `%${req.query.username}%` })
    }

    // APLICANDO ORDENAÇÃO DE DADOS PELO CAMPO NOME
    const sort: any = req.query.sort

    if (sort) {
      builder.orderBy('user.username', sort.toLowerCase())
    }

    // APLICANDO REGRA DE PAGINAÇÃO NO GET
    const page: number = parseInt(req.query.page as any) || 1
    const pageSize = 5
    const total = await builder.getCount()

    builder.offset((page - 1) * pageSize).limit(pageSize)

    return res.send(
      await builder.getMany(), // RETORNA TODOS OS ITEMS DO BANCO
    )
  };

  public async getById(req: Request, res: Response) {
    //Get the ID from the url
    const id: string = req.params.id;

    //Get the user from database
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail({
        select: ["username", "role", "dateUpdated", "dateRegister"],
        where: { uuid: id }
      });
      return res.status(200).send(user);
    } catch (error) {
      return res.status(404).send("User not found");
    }
  };

  public async createUser(req: Request, res: Response) {
    //Get parameters from the body
    let { username, password, role } = req.body;

    let user = new User();

    if(Object.values(UserRole).includes(role)){
      user.role = role;
    } else {
      return res.status(400).send({
        message: "Campo 'role' inválido."
      });
    }

    user.username = String(username).trim()
    user.password = password;
    user.dateRegister = moment().format('YYYY-MM-DD HH:mm:ss');


    //Try to save. If fails, the username is already in use
    try {
      const userRepository = getRepository(User);

      if (await userRepository.findOne({ where: { username: username } })) {
        return res.status(400).send({
          usernameIsValid: false
        })
      }

      const newUser = await userRepository.save(user);

      //If all ok, send 201 response
      return res.status(201).send(newUser);
    } catch (e) {
      return res.status(400).send({
        message: "Campos inválidos."
      })
    }
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
      user = await userRepository.findOneOrFail({ where: { uuid: id } });
    } catch (error) {
      //If not found, send a 404 response
      return res.status(404).send("User not found");
    }

    if (username) {
      if (await userRepository.findOne({ where: { username } })) {
        return res.status(400).send({
          usernameIsValid: false
        })
      }
    }

    if(Object.values(UserRole).includes(role)){
      user.role = role;
    } else {
      return res.status(400).send({
        message: "Campo 'role' inválido."
      });
    }

    //Validate the new values on model
    user.username = String(username).trim();
    user.dateUpdated = moment().format('YYYY-MM-DD HH:mm:ss');

    //Try to safe, if fails, that means username already in use
    try {
      await userRepository.save(user);
    } catch (e) {
      return res.status(409).send("Some of the passed values are in a invalid format");
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
      user = await userRepository.findOneOrFail({ where: { uuid: id } });
    } catch (error) {
      return res.status(404).send("User not found");
    }

    userRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    return res.status(204).send();
  };
};

export default new UserController();