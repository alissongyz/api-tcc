//import moment = require("moment");
import { EntityRepository, Repository } from "typeorm";
//import { StatusControlEnum } from "../enums/status-control-enum";
import { Material } from "../models/Material";

@EntityRepository(Material)
export class MaterialRepository extends Repository<Material> {

    public findAll() {
        const query = this.createQueryBuilder("")
            .select("*")

        return query.getRawMany();
    }

    public findByUuid(uuid: string): Promise<Material> {
        return this.findOne({ uuid: uuid });
    }

    /*public delete(material: Material) {
        return this.createQueryBuilder()
            .update(material)
            .set({ deleted: true, dateUpdated: moment().format("YYYY-MM-DD HH:MM:SS") })
            .where("uuid = :uuid", { id: material.uuid })
            .execute();
    }*/
}
