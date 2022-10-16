import { getConnection } from "typeorm";
import { Provides } from "typescript-ioc";
import { IOrderService } from "../i-order-service";
import { OrderRepository } from "../../repository/order-repository";
import { Order } from "../../models/Order";
import { MultipleOrder } from "../../dto/multiple-order-dto";
import { Guid } from "guid-typescript";

@Provides(OrderService)
export class OrderService
    implements IOrderService {

    private repository = getConnection().getCustomRepository(
        OrderRepository
    );

    public async multipleOrder(multipleOrder: MultipleOrder, user: any): Promise<any> {

        const sessionUser = user.username;
        const currentDate = new Date();
        const generateOrderNumber = Math.floor(Math.random() * 65536);

        multipleOrder = {
            itemsMaterial: {
                uuid: this.randown(),
                nroOrder: generateOrderNumber,
                requiredBy: sessionUser,
                itemName: multipleOrder.itemsMaterial.itemName,
                qnty: multipleOrder.itemsMaterial.qnty,
                motive: multipleOrder.itemsMaterial.motive,
                status: "PENDING",
                dateRegister: currentDate,
            },
            itemsMedicine: {
                uuid: this.randown(),
                nroOrder: generateOrderNumber,
                requiredBy: sessionUser,
                itemName: multipleOrder.itemsMedicine.itemName,
                qnty: multipleOrder.itemsMedicine.qnty,
                motive: multipleOrder.itemsMedicine.motive,
                status: "PENDING",
                dateRegister: currentDate,
            }
        };

        await this.repository.save(
            multipleOrder.itemsMaterial
        );

        await this.repository.save(
            multipleOrder.itemsMedicine
        );

        return {
            orderCreated: multipleOrder
        };
    }

    public findByUuid(uuid: string): Promise<Order> {
        return this.repository.findByUuid(uuid);
    }

    public findByStatusPending(): Promise<Array<Order>> {
        return this.repository.findByStatusPending();
    }

    public findByStatusAuthorizedAndNotAuthorized(): Promise<Array<Order>> {
        return this.repository.findByStatusAuthorizedAndNotAuthorized();
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

    private randown() {
        return Guid.create().toString();
    }
}
