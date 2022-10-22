import { EntityRepository, Repository } from "typeorm";
import { User } from "../models/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    public async findAll() {
        const query = this.createQueryBuilder("")
            .select("*")

        return await query.getRawMany();
    }

    public async findByUserName(username: string): Promise<User> {
        return await this.findOne({ username: username });
    }

    public async findByUuid(uuid: string): Promise<User> {
        return await this.findOne({ uuid: uuid });
    }

    /*public async delete(material: Material) {
        return await this.createQueryBuilder()
            .update(material)
            .set({ deleted: true, dateUpdated: moment().format("YYYY-MM-DD HH:MM:SS") })
            .where("uuid = :uuid", { id: material.uuid })
            .execute();
    }*/
}
