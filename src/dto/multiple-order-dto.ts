
export class MultipleOrder {
    public itemsMaterial: MaterialOrder;
    public itemsMedicine: MedicineOrder;
}

export class MaterialOrder {
    public uuid: string;
    public nroOrder: number;
    public requiredBy: string;
    public approvedBy?: string;
    public itemName: string;
    public qnty: number;
    public motive: string;
    public status: string;
    public deleted?: boolean;
    public dateRegister: Date;
    public dateUpdated?: Date;
}

export class MedicineOrder {
    public uuid: string;
    public nroOrder: number;
    public requiredBy: string;
    public approvedBy?: string;
    public itemName: string;
    public qnty: number;
    public motive: string;
    public status: string;
    public deleted?: boolean;
    public dateRegister: Date;
    public dateUpdated?: Date;
}