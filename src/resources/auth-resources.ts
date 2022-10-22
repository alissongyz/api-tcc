import { Inject } from "typescript-ioc";
import {
  ContextResponse,
  HeaderParam,
  Path,
  POST,
} from "typescript-rest";
import { ChangePasswordDto } from "../dto/change-password-dto";
import { LoginDto } from "../dto/login-dto";
import { AuthService } from "../services/imp/auth-service";
import { JwtMiddleware } from "../middlewares/check-jwt-middleware";

import express = require("express");
@Path("/v1")
export class AuthResources {
  @Inject
  private service: AuthService;

  @Inject
  private authMiddleware: JwtMiddleware;

  @POST
  @Path("access-token")
  public async accessToken(
    login: LoginDto,
  ): Promise<any> {
    return await this.service.login(login);
  }

  @POST
  @Path("change-password")
  public async changePassword(
    changePassword: ChangePasswordDto,
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ): Promise<any> {
    if (!this.authMiddleware.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    const parsedToken: any = this.authMiddleware.getParsedToken(authorization);

    const user = {
      uuid: parsedToken.payload.userId
    };

    return await this.service.changePassword(changePassword, user);
  }
}
