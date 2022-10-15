import moment = require("moment");
import { getConnection } from "typeorm";
import { Provides } from "typescript-ioc";
import { Material } from "../../models/Material";
import { MaterialRepository } from "../../repository/material-repository";
import { IMaterialrService } from "../i-material-service";
import { Guid } from "guid-typescript";

@Provides(MaterialService)
export class MaterialService
    implements IMaterialrService {

    private repository = getConnection().getCustomRepository(
        MaterialRepository
    );

    public async save(
        material: Material
    ): Promise<Material> {

        material.uuid = this.randown();
        material.dateRegister = new Date()

        return this.repository.save(material)
    }

    public async update(
        uuid: string,
        material: Material
    ): Promise<Material> {
        const data = await this.findByUuid(uuid)

        material.uuid = data.uuid;
        material.dateUpdated = data.uuid;
        material.dateUpdated = moment().format("YYYY-MM-DD HH:MM:SS")

        await this.repository.update({ uuid: uuid }, material);

        return await this.findByUuid(uuid)
    }

    public findAll(
    ): Promise<Array<Material>> {
        return this.repository.findAll();
    }

    public findByUuid(uuid: string): Promise<Material> {
        return this.repository.findByUuid(uuid);
    }

    public delete(uuid: string): void {
        this.findByUuid(uuid).then((material) => {
            this.repository.delete(material);
        });
    }

    private randown() {
        return Guid.create().toString();
    }
}