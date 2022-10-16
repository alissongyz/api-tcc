import { MultipleOrder } from "../dto/multiple-order-dto";
import { Order } from "../models/Order";

export interface IOrderService {

    findByStatusPending(): Promise<Array<Order>>;
    
    findByStatusAuthorizedAndNotAuthorized(): Promise<Array<Order>>;

    findByUuid(
        uuid: string
    ): Promise<Order>;

    multipleOrder(
        multipleOrder: MultipleOrder,
        user: any
    ): Promise<Order>;
}
