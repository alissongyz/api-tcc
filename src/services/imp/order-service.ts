import { getConnection } from "typeorm";
import { Provides } from "typescript-ioc";
import { IOrderService } from "../i-order-service";
import { OrderRepository } from "../../repository/order-repository";
import { Order } from "../../models/Order";
//import { Guid } from "guid-typescript";

@Provides(OrderService)
export class OrderService
    implements IOrderService {

    private repository = getConnection().getCustomRepository(
        OrderRepository
    );

    public async findByUuid(uuid: string): Promise<Order> {
        return await this.repository.findByUuid(uuid);
    }

    public async findByStatusPending(): Promise<Array<Order>> {
        return await this.repository.findByStatusPending();
    }

    public async findByStatusAuthorizedAndNotAuthorized(): Promise<Array<Order>> {
        return await this.repository.findByStatusAuthorizedAndNotAuthorized();
    }

    public async repprovedOrder(
        uuid: string,
        order: Order
    ): Promise<Order> {
        const data = await this.findByUuid(uuid);

        order.uuid = data.uuid;
        order.status = "NOT_AUTHORIZED";
        order.dateUpdated = new Date();
        order.deleted = true;

        await this.repository.update({
            uuid: uuid
        }, order);

        return await this.findByUuid(uuid);
    }

    /*private randown() {
        return Guid.create().toString();
    }*/
}
