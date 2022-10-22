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

        return await this.repository.save(material)
    }

    public async update(
        uuid: string,
        material: Material
    ): Promise<Material> {
        const data = await this.findByUuid(uuid)

        material.uuid = data.uuid;
        material.dateUpdated = new Date()

        await this.repository.update({ uuid: uuid }, material);

        return await this.findByUuid(uuid)
    }

    public async findAll(
    ): Promise<Array<Material>> {
        return await this.repository.findAll();
    }

    public async findByUuid(uuid: string): Promise<Material> {
        return await this.repository.findByUuid(uuid);
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
