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
import { OrderService } from "../services/imp/order-service";
import { Order } from "../models/Order";
import { OrderController } from "../controllers/Order-controller";
import { MultipleOrder } from "../dto/multiple-order-dto";

import express = require("express");
import { JwtMiddleware } from "../middlewares/check-jwt-middleware";
@Path("/v1")
export class OrderResources {
  @Inject
  private service: OrderService;

  @Inject orderController: OrderController;

  @Inject
  private authMiddleware: JwtMiddleware;

  @GET
  @Path("order-pending")
  public async findByStatusPending(
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ): Promise<any> {

    if (!this.authMiddleware.validateAuth(authorization)) {
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

    if (!this.authMiddleware.validateAuth(authorization)) {
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

    if (!this.authMiddleware.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido",
      });
    }

    const parsedToken: any = this.authMiddleware.getParsedToken(authorization);

    const user = {
      username: parsedToken.payload.username
    }

    return await this.service.multipleOrder(multipleOrder, user);
  }

  @DELETE
  @Path("/repproved-order/:uuid")
  public async delete(
    @PathParam("uuid") uuid: string,
    order: Order,
    @HeaderParam("authorization") authorization: string,
    @ContextResponse res: express.Response
  ){

    if (!this.authMiddleware.validateAuth(authorization)) {
      return res.status(400).send({
        message: "Token inválido"
      });
    }

    return await this.service.repprovedOrder(uuid, order);
  }
}
