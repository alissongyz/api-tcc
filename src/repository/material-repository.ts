import { EntityRepository, Repository } from "typeorm";
import { Material } from "../models/Material";

@EntityRepository(Material)
export class MaterialRepository extends Repository<Material> {

    public async findAll() {
        const query = this.createQueryBuilder("")
            .select("*")

        return await query.getRawMany();
    }

    public async findByUuid(uuid: string): Promise<Material> {
        return await this.findOne({ uuid: uuid });
    }

    /*public async delete(material: Material) {
        return await  this.createQueryBuilder()
            .update(material)
            .set({ deleted: true, dateUpdated: moment().format("YYYY-MM-DD HH:MM:SS") })
            .where("uuid = :uuid", { id: material.uuid })
            .execute();
    }*/
}
