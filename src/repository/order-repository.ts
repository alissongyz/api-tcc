import { EntityRepository, Repository } from "typeorm";
import { Order } from "../models/Order";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {

    public async findByUuid(uuid: string): Promise<Order> {
        return await this.findOne({ uuid: uuid });
    }

    public async findByStatusPending() {
        return await this.createQueryBuilder("")
            .select("*")
            .where({
                status: "PENDING"
            })
            .orderBy("id", "DESC")
            .getRawMany()
    }

    public async findByStatusAuthorizedAndNotAuthorized() {
        return await this.createQueryBuilder("order")
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
