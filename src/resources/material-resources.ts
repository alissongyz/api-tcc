import { Inject } from "typescript-ioc";
import {
  ContextResponse,
  DELETE,
  FileParam,
  GET,
  Path,
  PathParam,
  POST,
  PUT,
} from "typescript-rest";
import { Material } from "../models/Material";
import { MaterialService } from "../services/imp/material-service";

import express = require("express");
import { ExportFileService } from "../services/imp/export-file-service";
import { AxiosError } from "axios";

@Path("/v1/material")
export class MaterialResources {
  @Inject
  private service: MaterialService;

  @Inject
  private exportFileService: ExportFileService

  @GET
  @Path("")
  public findAll(
  ): Promise<any> {
    return this.service.findAll();
  }

  @GET
  @Path(":uuid")
  public findByUuid(
    @PathParam("uuid") uuid: string,
  ): Promise<Material> {
    return this.service.findByUuid(uuid);
  }

  @POST
  @Path("")
  public save(
    material: Material,
  ): Promise<Material> {
    return this.service.save(material);
  }

  @PUT
  @Path("/:uuid")
  public async update(
    @PathParam("uuid") uuid: string,
    material: Material,
    @ContextResponse res: express.Response
  ) {
    try {
      console.log("UUID", uuid)
      return this.service.update(uuid, material);
    } catch (err) {
      return res.status(400).send("deu ruim");
    }
  }

  // Esse método está desativado, por falta de informações na tabela de material. Obs: "Excluir um dado do banco NÃO É UMA BOA PRÁTICA!".
  @DELETE
  @Path(":uuid")
  public delete(
    @PathParam("uuid") uuid: string
  ) {
    return this.service.delete(uuid);
  }

  @Path('upload')
  @POST
  public upload(
    @FileParam('xls') xls: Express.Multer.File,
    @ContextResponse res: express.Response
  ): any {

    return this.exportFileService
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
