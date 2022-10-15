//import { UuidService } from "@wlp/api-core";
import * as xlsx from "node-xlsx";
import { Inject, Provides } from "typescript-ioc";
import { MaterialDto } from "../../dto/material-dto";
import { IExportFileService } from "../i-export-file";
import { MaterialService } from "./material-service";

@Provides(ExportFileService)
export class ExportFileService implements IExportFileService {
    @Inject
    private materialService: MaterialService;

    public async uploadMaterial(xls: Express.Multer.File): Promise<any> {
        let qtd = 0;
        let qtdError = 0;
        const tst = xlsx.parse(xls.buffer)[0].data;
        const materialDto = new MaterialDto();

        for (const line of tst) {
            const index = tst.indexOf(line);

            if (index > 0) {
                const linha: Array<string> = line.toString().split(",");
                if (linha[1] === null || linha[1] === "" || linha[4] === "") {
                    qtdError++;
                } else {
                    console.log("PROCESSANDO LINHA: ", index);

                    // Reading the file
                    materialDto.name = linha[0].toUpperCase();
                    materialDto.qnty = linha[1];
                    materialDto.descQnty = linha[2];
                    materialDto.minQnty = linha[3];
                    materialDto.unitValue = linha[4];
                    materialDto.grossValue = linha[5];
                    materialDto.expiration = linha[6];

                    console.log(materialDto);

                    await this.materialService.save(
                        materialDto
                    );
                    qtd++;
                }
            }
        }
        return {
            status: "FINISHED",
            message:
                "FOI INSERIDO " +
                qtd +
                " MATERIAIS NO ESTOQUE - " +
                qtdError +
                " BLANK LINES",
        };
    }
}
