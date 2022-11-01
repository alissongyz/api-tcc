import { getConnection } from "typeorm";
import { LoginDto } from "../../dto/login-dto";
import { UserRepository } from "../../repository/user-repository";
import { IAuthService } from "../i-auth-service";
import * as jwt from "jsonwebtoken";
import config from "../../config/config";
import { ChangePasswordDto } from "../../dto/change-password-dto";
import HttpException from "../../exception/httpException";
import { Inject } from "typescript-ioc";
import { UserService } from "./user-service";

export class AuthService implements IAuthService {

    private repository = getConnection().getCustomRepository(
        UserRepository
    );

    @Inject
    private userService: UserService;

    public async login(loginDto: LoginDto): Promise<any> {

        const username = await this.repository.findByUserName(loginDto.username)

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

    public async changePassword(changePassword: ChangePasswordDto, user: any): Promise<any> {

        if (!changePassword.oldPassword || !changePassword.newPassword) {
            throw new HttpException(
                400,
                "Preencha os campos de senha.",
                null
            );
        }

        const findUser = await this.userService.findByUuid(user.uuid);

        if (changePassword.oldPassword === findUser.password) {
            findUser.password = changePassword.newPassword;

            await this.userService.update(findUser.uuid, findUser);
        }

        return {
            status: "FINISHED -> UPDATED PASSOWRD",
            username: findUser.username,
        }
    }
}