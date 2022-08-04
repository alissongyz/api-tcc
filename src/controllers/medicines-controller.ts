import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as moment from "moment";

import { Medicines } from "../models/Medicines";

class medicinesController {

  public async getAll(req: Request, res: Response) {
    //Get users from database
    const builder = getRepository(Medicines).createQueryBuilder('medicines');

    // Aplicando Filtros no GET ALL
    if (req.query.name) {
      builder.where("medicines.name LIKE :name", { name: `%${req.query.name}%` })
    }

    // APLICANDO ORDENAÇÃO DE DADOS PELO CAMPO NOME
    const sort: any = req.query.sort

    if (sort) {
      builder.orderBy('medicines.name', sort.toLowerCase())
    }

    return res.send(
      await builder.getMany(), // RETORNA TODOS OS ITEMS DO BANCO
    )
  };

  public async getById(req: Request, res: Response) {
    //Get the ID from the url
    const id: string = req.params.id;

    //Get the user from database
    const medicinesRepository = getRepository(Medicines);
    try {
      const medicine = await medicinesRepository.findOneOrFail({
        where: { uuid: id }
      });
      return res.status(200).send(medicine);
    } catch (error) {
      return res.status(404).send("Medicine not found");
    }
  };

  public async createMedicine(req: Request, res: Response) {
    //Get parameters from the body
    //validty JSON deve ser YYYY-MM-DD
    let { name, qnty, minQnty, descQnty, valueOfInput, validity, lote } = req.body;

    let medicine = new Medicines();
    
    medicine.name = name;
    medicine.qnty = qnty;
    medicine.minQnty = minQnty;
    medicine.descQnty = descQnty;
    medicine.valueOfInput = valueOfInput;
    medicine.grossValue = qnty * valueOfInput;
    medicine.lote = lote;
    medicine.validity = moment(validity).format('YYYY-MM-DD');
    medicine.dateRegister = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
      const medicinesRepository = getRepository(Medicines);

      const newMedicine = await medicinesRepository.save(medicine);

      //If all ok, send 201 response
      return res.status(201).send(newMedicine);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Error while trying create a new medicine");
    }

  };

  public async updateMedicine(req: Request, res: Response) {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    const { name, qnty, minQnty, descQnty, valueOfInput, validity, lote } = req.body;
    let medicine: Medicines = null;

    //Try to find user on database
    const medicineRepository = getRepository(Medicines);

    try {
      medicine = await medicineRepository.findOneOrFail({ where: { uuid: id } });
    } catch (error) {
      //If not found, send a 404 response
      return res.status(404).send("Medicine not found");
    }

    //Validate the new values on model
    medicine.name = name;
    medicine.descQnty = descQnty;
    medicine.validity = moment(validity).format('YYYY-MM-DD');
    medicine.qnty = qnty;
    medicine.minQnty = minQnty;
    medicine.valueOfInput = valueOfInput;
    medicine.lote = lote;
    medicine.dateUpdated = moment().format('YYYY-MM-DD HH:mm:ss');

    //Try to safe, if it fails, an error was found trying to save in the database
    try {
      await medicineRepository.save(medicine);
      //After all send a 204 (no content, but accepted) response
      return res.status(204).send();
    } catch (e) {
      console.log(e);
      return res.status(502).send("Some of the passed values are in a invalid format");
    }
  };

  public async deleteMedicine(req: Request, res: Response) {
    //Get the ID from the url
    const id = req.params.id;

    const medicineRepository = getRepository(Medicines);

    let medicine: Medicines;

    try {
      medicine = await medicineRepository.findOneOrFail({ where: { uuid: id } });
      medicineRepository.delete(id);

      //After all send a 204 (no content, but accepted) response
      return res.status(204).send();
    } catch (error) {
      return res.status(404).send("Medicine not found");
    }

  };

};

export default new medicinesController();