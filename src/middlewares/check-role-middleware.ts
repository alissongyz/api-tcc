import { Inject } from "typescript-ioc";
import HttpException from "../exception/httpException";
import { UserService } from "../services/imp/user-service";
import { JwtMiddleware } from "./check-jwt-middleware";


export class RoleMiddleware {
    @Inject
    private jwtMiddleware: JwtMiddleware;

    @Inject
    private userService: UserService;

    public async checkRole(roles: Array<string>, authorization: any) {

        const parsedToken: any = this.jwtMiddleware.getParsedToken(authorization);

        const user = {
            userUuid: parsedToken.payload.userId
        };

        const findUser = await this.userService.findByUuid(user.userUuid);

        if (!findUser) {
            throw new HttpException(
                400,
                "Usuário não localizado.",
                null
            );
        }

        if (roles.indexOf(findUser.role) > -1) {
            console.log("Usuário autorizado!")
        }
        else {
            throw new HttpException(
                400,
                "Você não tem autorização para executar essa ação.",
                null
            );
        }
    }
}