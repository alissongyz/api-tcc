import { LoginDto } from "../dto/login-dto";

export interface IAuthService {
    login(
        loginDto: LoginDto
    ): Promise<any>;
}
