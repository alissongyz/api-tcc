import { AxiosResponse } from "axios";

export interface IExportFileService {
   uploadMaterial(xls: Express.Multer.File): Promise<AxiosResponse>;
}
