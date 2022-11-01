import { Order } from "../models/Order";

export interface IOrderService {

    findByStatusPending(): Promise<Array<Order>>;
    
    findByStatusAuthorizedAndNotAuthorized(): Promise<Array<Order>>;

    findByUuid(
        uuid: string
    ): Promise<Order>;
}
