import { Material } from "../models/Material";

export interface IMaterialrService {
    save(
        material: Material
    ): Promise<Material>;

    findByUuid(
        uuid: string
    ): Promise<Material>;

    findAll(): Promise<Array<Material>>;

    update(
        uuid: string,
        material: Material
    ): Promise<Material> 
}
