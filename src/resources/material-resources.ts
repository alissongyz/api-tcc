import { Inject } from "typescript-ioc";
import {
  ContextResponse,
  DELETE,
  FileParam,
  GET,
  HeaderParam,
  Path,
  PathParam,
  POST,
  PUT,
} from "typescript-rest";
import { Material } from "../models/Material";
import { MaterialService } from "../services/imp/material-service";
import { ExportFileService } from "../services/imp/export-file-service";
import { AxiosError } from "axios";
import { JwtMiddleware } from "../middlewares/check-jwt-middleware";

import express = require("express");
@Path("/v1/material")
export class MaterialResources {
  @Inject
  private service: MaterialService;

  @Inject
  private authMiddleware: JwtMiddleware;

  @Inject
  private exportFileService: ExportFileService

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
    material: Material,
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ): Promise<any> {

    if (!this.authMiddleware.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    return await this.service.save(material);
  }

  @PUT
  @Path("/:uuid")
  public async update(
    @PathParam("uuid") uuid: string,
    material: Material,
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ) {

    if (!this.authMiddleware.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    return await this.service.update(uuid, material);
  }

  // Esse método não está funcionando por falta de informações na tabela de material. Obs: "Excluir um dado do banco NÃO É UMA BOA PRÁTICA!".
  @DELETE
  @Path(":uuid")
  public delete(
    @PathParam("uuid") uuid: string,
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ) {

    if (!this.authMiddleware.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    return this.service.delete(uuid);
  }

  @Path('upload')
  @POST
  public async upload(
    @FileParam('xls') xls: Express.Multer.File,
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ): Promise<any> {

    if (!this.authMiddleware.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    return await this.exportFileService
      .uploadMaterial(xls)
      .then(response => {
        return response;
      })
      .catch((e: AxiosError) => {
        console.log('Deu erro na chamada da API', e);
        res.status(400).send({ error: true })
      });
  }
}
