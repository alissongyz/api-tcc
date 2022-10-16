import { EntityRepository, Repository } from "typeorm";
import { Medicines } from "../models/Medicines";

@EntityRepository(Medicines)
export class MedicinesRepository extends Repository<Medicines> {

    public findAll() {
        const query = this.createQueryBuilder("")
            .select("*")

        return query.getRawMany();
    }

    public findByUuid(uuid: string): Promise<Medicines> {
        return this.findOne({ uuid: uuid });
    }

    /*public delete(medicine: Medicines) {
        return this.createQueryBuilder()
            .update(material)
            .set({ deleted: true, dateUpdated: moment().format("YYYY-MM-DD HH:MM:SS") })
            .where("uuid = :uuid", { id: material.uuid })
            .execute();
    }*/
}
