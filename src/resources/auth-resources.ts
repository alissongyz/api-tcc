import { Inject } from "typescript-ioc";
import {
  Path,
  POST,
} from "typescript-rest";
import { LoginDto } from "../dto/login-dto";
import { AuthService } from "../services/imp/auth-service";

@Path("/v1")
export class AuthResources {
  @Inject
  private service: AuthService;

  @POST
  @Path("access-token")
  public save(
    login: LoginDto,
  ): Promise<any> {
    return this.service.login(login);
  }
}
