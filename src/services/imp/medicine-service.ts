import { getConnection } from "typeorm";
import { Provides } from "typescript-ioc";
import { Guid } from "guid-typescript";
import { IMedicineService } from "../i-medicine-service";
import { Medicines } from "../../models/Medicines";
import { MedicinesRepository } from "../../repository/medicine-repository";

@Provides(MedicineService)
export class MedicineService
    implements IMedicineService {

    private repository = getConnection().getCustomRepository(
        MedicinesRepository
    );

    public async save(
        medicine: Medicines
    ): Promise<Medicines> {

        medicine.uuid = this.randown();
        medicine.dateRegister = new Date()

        return await this.repository.save(medicine)
    }

    public async update(
        uuid: string,
        medicine: Medicines
    ): Promise<Medicines> {
        const data = await this.findByUuid(uuid)

        medicine.uuid = data.uuid;
        medicine.dateUpdated = new Date()

        await this.repository.update({ uuid: uuid }, medicine);

        return await this.findByUuid(uuid)
    }

    public async findAll(
    ): Promise<Array<Medicines>> {
        return await this.repository.findAll();
    }

    public async findByUuid(uuid: string): Promise<Medicines> {
        return await this.repository.findByUuid(uuid);
    }

    public delete(uuid: string): void {
        this.findByUuid(uuid).then((medicine) => {
            this.repository.delete(medicine);
        });
    }

    private randown() {
        return Guid.create().toString();
    }
}
