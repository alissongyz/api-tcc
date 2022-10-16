import { Inject } from "typescript-ioc";
import {
  ContextResponse,
  DELETE,
  GET,
  Path,
  PathParam,
  POST,
  PUT,
} from "typescript-rest";
import { MedicineService } from "../services/imp/medicine-service";

import express = require("express");
import { Medicines } from "../models/Medicines";

@Path("/v1/medicines")
export class MedicineResources {
  @Inject
  private service: MedicineService;

  /*@Inject
  private exportFileService: ExportFileService*/

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
  ): Promise<Medicines> {
    return this.service.findByUuid(uuid);
  }

  @POST
  @Path("")
  public save(
    material: Medicines,
  ): Promise<Medicines> {
    return this.service.save(material);
  }

  @PUT
  @Path("/:uuid")
  public async update(
    @PathParam("uuid") uuid: string,
    medicine: Medicines,
    @ContextResponse res: express.Response
  ) {
    try {
      return this.service.update(uuid, medicine);
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

  /*@Path('upload')
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
  }*/
}
