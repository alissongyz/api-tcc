import { EntityRepository, Repository } from "typeorm";
import { Order } from "../models/Order";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {

    public findByUuid(uuid: string): Promise<Order> {
        return this.findOne({ uuid: uuid });
    }

    public findByStatusPending() {
        return this.createQueryBuilder("")
            .select("*")
            .where({
                status: "PENDING"
            })
            .orderBy("id", "DESC")
            .getRawMany()
    }

    public findByStatusAuthorizedAndNotAuthorized() {
        return this.createQueryBuilder("order")
            .select("*")
            .where(
                { status: "AUTHORIZED" }
            )
            .orWhere(
                "order.status = :status",
                { status: "NOT_AUTHORIZED" }
            )
            .orderBy("id", "DESC")
            .getRawMany()
    }
}
