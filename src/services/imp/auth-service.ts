import { getConnection } from "typeorm";
import { LoginDto } from "../../dto/login-dto";
import { UserRepository } from "../../repository/user-repository";
import { IAuthService } from "../i-auth-service";
import * as jwt from "jsonwebtoken";
import config from "../../config/config";

export class AuthService implements IAuthService {

    private repository = getConnection().getCustomRepository(
        UserRepository
    );

    public async login(loginDto: LoginDto): Promise<any> {

        const username = await this.repository.findByUserName(loginDto.username)

        console.log("username", username)

        if (!username) {
            return {
                userInvalid: true
            }
        }

        if (username.password === loginDto.password) {

            const token = jwt.sign(
                { userId: username.uuid, username: username.username },
                config.jwtSecret,
                { expiresIn: "1d" }
            );

            return { "access-token": token };
        } else {
            return {
                passwordIvalid: true
            }
        }

    }
}