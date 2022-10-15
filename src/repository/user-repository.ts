import { EntityRepository, Repository } from "typeorm";
import { User } from "../models/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    public findAll() {
        const query = this.createQueryBuilder("")
            .select("*")

        return query.getRawMany();
    }

    public findByUserName(username: string): Promise<User> {
        return this.findOne({ username: username });
    }

    public findByUuid(uuid: string): Promise<User> {
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
