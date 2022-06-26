import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as moment from "moment";

import { Material } from "../models/Material";

class MaterialController {

  public async getAll(req: Request, res: Response) {
    //Get users from database
    const builder = getRepository(Material).createQueryBuilder('material');

    // Aplicando Filtros no GET ALL
    if (req.query.name) {
      builder.where("material.name LIKE :name", { name: `%${req.query.name}%` })
    } else if (req.query.descQnty) {
      builder.where("material.descQnty LIKE :descQnty", { descQnty: `%${req.query.descQnty}%` })
    }

    // APLICANDO ORDENAÇÃO DE DADOS PELO CAMPO NOME
    const sort: any = req.query.sort

    if (sort) {
      builder.orderBy('material.name', sort.toLowerCase())
    }

    // APLICANDO REGRA DE PAGINAÇÃO NO GET
    const page: number = parseInt(req.query.page as any) || 1
    const pageSize = 8
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
    const materialRepository = getRepository(Material);
    try {
      const material = await materialRepository.findOneOrFail({
        select: ["name", "qnty", "descQnty", "minQnty", "unitValue", "expiration", "dateUpdated", "dateRegister"],
        where: { uuid: id }
      });
      return res.status(200).send(material);
    } catch (error) {
      return res.status(404).send("Material not found");
    }
  };

  public async createMaterial(req: Request, res: Response) {
    //Get parameters from the body
    //expiration JSON deve ser YYYY-MM-DD
    let { name, qnty, descQnty, minQnty, unitValue, expiration } = req.body;
    let material = new Material();
    material.name = name;
    material.qnty = qnty;
    material.descQnty = descQnty;
    material.minQnty = minQnty;
    material.unitValue = unitValue;
    material.expiration = moment(expiration).format('YYYY-MM-DD');
    material.dateRegister = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
      const materialRepository = getRepository(Material);

      const newMaterial = await materialRepository.save(material);

      //If all ok, send 201 response
      return res.status(201).send(newMaterial);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Error while trying create a new material");
    }

  };

  public async updateMaterial(req: Request, res: Response) {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    const { name, qnty, descQnty, minQnty, unitValue, expiration } = req.body;
    let material: Material = null;

    //Try to find user on database
    const materialRepository = getRepository(Material);

    try {
      material = await materialRepository.findOneOrFail({ where: { uuid: id } });
    } catch (error) {
      //If not found, send a 404 response
      return res.status(404).send("Material not found");
    }

    //Validate the new values on model
    material.name = name;
    material.descQnty = descQnty;
    material.expiration = moment(expiration).format('YYYY-MM-DD');
    material.qnty = qnty;
    material.minQnty = minQnty;
    material.unitValue = unitValue;
    material.dateUpdated = moment().format('YYYY-MM-DD HH:mm:ss');

    //Try to safe, if it fails, an error was found trying to save in the database
    try {
      await materialRepository.save(material);
      //After all send a 204 (no content, but accepted) response
      return res.status(204).send();
    } catch (e) {
      console.log(e);
      return res.status(502).send("Some of the passed values are in a invalid format");
    }
  };

  public async deleteMaterial(req: Request, res: Response) {
    //Get the ID from the url
    const id = req.params.id;

    const materialRepository = getRepository(Material);

    let material: Material;

    try {
      material = await materialRepository.findOneOrFail({ where: { uuid: id } });
      materialRepository.delete(id);

      //After all send a 204 (no content, but accepted) response
      return res.status(204).send();
    } catch (error) {
      return res.status(404).send("Material not found");
    }

  };

};

export default new MaterialController();