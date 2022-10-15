import { User } from "../models/User";

export interface IUserService {
    save(
        user: User
    ): Promise<User>;

    findByUuid(
        uuid: string
    ): Promise<User>;

    findAll(): Promise<Array<User>>;

    update(
        uuid: string,
        user: User
    ): Promise<User> 
}
