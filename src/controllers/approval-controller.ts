import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as moment from "moment";

import { Approval } from "../models/Approval";

class ApprovalController {

    public async createApproval(req: Request, res: Response) {
        //Get parameters from the body
        let { userName, itemName, qnty, motive } = req.body;

        let approval = new Approval();

        approval.userName = userName;
        approval.itemName = itemName;
        approval.qnty = qnty;
        approval.motive = motive;
        approval.status = "PENDING";
        approval.dateRegister = moment().format('YYYY-MM-DD HH:mm:ss');

        try {
            const approvalRepository = getRepository(Approval);

            const newApproval = await approvalRepository.save(approval);

            //If all ok, send 201 response
            return res.status(201).send(newApproval);
        } catch (error) {
            console.log(error);
            return res.status(400).send({
                dataIsValid: false
            });
        }
    };

    public async findApprovalPending(req: Request, res: Response) {
        //Get users from database
        const builder = getRepository(Approval).createQueryBuilder('approval');

        builder.where({ status: "PENDING" })

        // APLICANDO ORDENAÇÃO DE DADOS PELO CAMPO NOME
        const sort: any = req.query.sort

        if (sort) {
            builder.orderBy('approval.userName', sort.toLowerCase())
        }

        // APLICANDO REGRA DE PAGINAÇÃO NO GET
        const page: number = parseInt(req.query.page as any) || 1
        const pageSize = 8
        const total = await builder.getCount()

        builder.offset((page - 1) * pageSize).limit(pageSize)

        return res.send(
            await builder.getMany(), // RETORNA TODOS OS ITEMS DO BANCO
        )
    }

};

export default new ApprovalController();