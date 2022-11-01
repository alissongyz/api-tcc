import { Medicines } from "../models/Medicines";

export interface IMedicineService {
    save(
        medicine: Medicines
    ): Promise<Medicines>;

    findByUuid(
        uuid: string
    ): Promise<Medicines>;

    findAll(): Promise<Array<Medicines>>;

    update(
        uuid: string,
        medicine: Medicines
    ): Promise<Medicines> 
}
