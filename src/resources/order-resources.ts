import { Inject } from "typescript-ioc";
import {
  ContextResponse,
  DELETE,
  GET,
  HeaderParam,
  Path,
  PathParam,
  POST,
} from "typescript-rest";
import * as jwt from "jsonwebtoken";

import express = require("express");
import { OrderService } from "../services/imp/order-service";
import { Order } from "../models/Order";
import { OrderController } from "../controllers/Order-controller";
import { MultipleOrder } from "../dto/multiple-order-dto";

@Path("/v1")
export class OrderResources {
  @Inject
  private service: OrderService;

  @Inject orderController: OrderController;

  @GET
  @Path("order-pending")
  public async findByStatusPending(
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ): Promise<any> {

    if (!this.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    return await this.service.findByStatusPending();
  }

  @GET
  @Path("orders-out")
  public async findByStatusAuthorizedAndNotAuthorized(
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ): Promise<any> {

    if (!this.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    return await this.service.findByStatusAuthorizedAndNotAuthorized();
  }

  @POST
  @Path("create-multiple-order")
  public async createMultipleOrder(
    multipleOrder: MultipleOrder,
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ): Promise<any> {

    if (!this.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido",
      });
    }

    const parsedToken: any = this.getParsedToken(authorization);

    const user = {
      username: parsedToken.payload.username
    }

    return this.service.multipleOrder(multipleOrder, user);
  }

  @DELETE
  @Path("/repproved-order/:uuid")
  public async delete(
    @PathParam("uuid") uuid: string,
    order: Order,
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ){

    if (!this.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    return this.service.repprovedOrder(uuid, order);
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
