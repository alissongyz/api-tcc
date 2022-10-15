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
import * as jwt from "jsonwebtoken";

import express = require("express");
import { User } from "../models/User";

@Path("/v1/user")
export class MaterialResources {
  @Inject
  private service: UserService;

  @GET
  @Path("")
  public async findAll(
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ): Promise<any> {

    if (!this.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    return await this.service.findAll();
  }

  @GET
  @Path(":uuid")
  public async findByUuid(
    @PathParam("uuid") uuid: string,
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ): Promise<any> {

    if (!this.validateAuth(authorization)) {
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
  ):  Promise<any> {

    if (!this.validateAuth(authorization)) {
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
  ):  Promise<any> {

    if (!this.validateAuth(authorization)) {
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

  // Esse método está desativado, por falta de informações na tabela de users. Obs: "Excluir um dado do banco NÃO É UMA BOA PRÁTICA!".
  @DELETE
  @Path(":uuid")
  public async delete(
    @PathParam("uuid") uuid: string,
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ): Promise<any> {

    if (!this.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    return await this.service.delete(uuid);
  }

  private getParsedToken(token: string) {
    token = String(token)
      .replace(" ", "")
      .replace("Bearer", "")
      .replace("bearer", "");

    return jwt.decode(token, { complete: true });
  }

  private validateAuth(authorization: string) {
    const parsedToken = this.getParsedToken(authorization);

    if (!parsedToken) {
      return false
    }

    return true
  }
}
