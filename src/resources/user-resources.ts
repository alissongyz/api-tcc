import { Inject } from "typescript-ioc";
import {
  ContextResponse,
  DELETE,
  GET,
  HeaderParam,
  Path,
  PathParam,
  POST,
  PUT,
} from "typescript-rest";
import { UserService } from "../services/imp/user-service";
import { User } from "../models/User";

import express = require("express");
import { JwtMiddleware } from "../middlewares/check-jwt-middleware";
import { RoleMiddleware } from "../middlewares/check-role-middleware";
import { UserRoleEnum } from "../enum/role-enum";
@Path("/v1/user")
export class MaterialResources {
  @Inject
  private service: UserService;

  @Inject
  private authMiddleware: JwtMiddleware;

  @Inject
  private roleMiddleware: RoleMiddleware;

  @GET
  @Path("")
  public async findAll(
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ): Promise<any> {

    if (!this.authMiddleware.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    await this.roleMiddleware.checkRole([UserRoleEnum.ADMIN.toString(), UserRoleEnum.FARMACEUTICO.toString()], authorization);

    return await this.service.findAll();
  }

  @GET
  @Path(":uuid")
  public async findByUuid(
    @PathParam("uuid") uuid: string,
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ): Promise<any> {

    if (!this.authMiddleware.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    return await this.service.findByUuid(uuid);
  }

  @POST
  @Path("")
  public async save(
    user: User,
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ): Promise<any> {

    if (!this.authMiddleware.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    return await this.service.save(user);
  }

  @PUT
  @Path("/:uuid")
  public async update(
    @PathParam("uuid") uuid: string,
    user: User,
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ): Promise<any> {

    if (!this.authMiddleware.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    try {
      return await this.service.update(uuid, user);
    } catch (err) {
      return res.status(400).send("deu ruim");
    }
  }

  // Esse método não está funcionando por falta de informações na tabela de users. Obs: "Excluir um dado do banco NÃO É UMA BOA PRÁTICA!".
  @DELETE
  @Path(":uuid")
  public async delete(
    @PathParam("uuid") uuid: string,
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ): Promise<any> {

    if (!this.authMiddleware.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    return this.service.delete(uuid);
  }
}
