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
import { MedicineService } from "../services/imp/medicine-service";
import { Medicines } from "../models/Medicines";
import { JwtMiddleware } from "../middlewares/check-jwt-middleware";

import express = require("express");
@Path("/v1/medicines")
export class MedicineResources {
  @Inject
  private service: MedicineService;

  @Inject
  private authMiddleware: JwtMiddleware;

  /*@Inject
  private exportFileService: ExportFileService*/

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
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response,
    @PathParam("uuid") uuid: string,
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
    material: Medicines,
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
    medicine: Medicines,
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ) {

    if (!this.authMiddleware.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    return await this.service.update(uuid, medicine);
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

  /*@Path('upload')
  @POST
  public async upload(
    @FileParam('xls') xls: Express.Multer.File,
    @ContextResponse res: express.Response
  ): any {

    return await this.exportFileService
      .uploadMaterial(xls)
      .then(response => {
        return await response;
      })
      .catch((e: AxiosError) => {
        console.log('Deu erro na chamada da API', e);
        res.status(400).send({ error: true })
      });
  }*/
}
