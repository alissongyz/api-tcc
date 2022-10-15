import { getConnection } from "typeorm";
import { Provides } from "typescript-ioc";
import { Guid } from "guid-typescript";
import { IUserService } from "../i-user-service";
import { UserRepository } from "../../repository/user-repository";
import { User } from "../../models/User";

@Provides(UserService)
export class UserService
    implements IUserService {

    private repository = getConnection().getCustomRepository(
        UserRepository
    );

    public async save(
        user: User
    ): Promise<User> {

        user.uuid = this.randown();
        user.dateRegister = new Date()

        return this.repository.save(user)
    }

    public async update(
        uuid: string,
        user: User
    ): Promise<User> {
        const data = await this.findByUuid(uuid)

        user.uuid = data.uuid;
        user.dateUpdated = new Date()

        await this.repository.update({ uuid: uuid }, user);

        return await this.findByUuid(uuid)
    }

    public findAll(
    ): Promise<Array<User>> {
        return this.repository.findAll();
    }

    public findByUuid(uuid: string): Promise<User> {
        return this.repository.findByUuid(uuid);
    }

    public delete(uuid: string): void {
        this.findByUuid(uuid).then((user) => {
            this.repository.delete(user);
        });
    }

    private randown() {
        return Guid.create().toString();
    }
}
