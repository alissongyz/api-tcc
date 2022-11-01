import { EntityRepository, Repository } from "typeorm";
import { Medicines } from "../models/Medicines";

@EntityRepository(Medicines)
export class MedicinesRepository extends Repository<Medicines> {

    public async findAll() {
        const query = this.createQueryBuilder("")
            .select("*")

        return await query.getRawMany();
    }

    public async findByUuid(uuid: string): Promise<Medicines> {
        return await this.findOne({ uuid: uuid });
    }

    /*public async delete(medicine: Medicines) {
        return await this.createQueryBuilder()
            .update(material)
            .set({ deleted: true, dateUpdated: moment().format("YYYY-MM-DD HH:MM:SS") })
            .where("uuid = :uuid", { id: material.uuid })
            .execute();
    }*/
}
