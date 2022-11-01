import { ChangePasswordDto } from "../dto/change-password-dto";
import { LoginDto } from "../dto/login-dto";

export interface IAuthService {
    login(
        loginDto: LoginDto
    ): Promise<any>;

    changePassword(
        changePassword: ChangePasswordDto,
        user: any,
    ): Promise<any>;
}
