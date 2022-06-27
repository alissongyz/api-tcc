import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as moment from "moment";
import * as jwt from "jsonwebtoken";

import { Order } from "../models/Order";
import { Material } from "../models/Material";
import authController from "./auth-controller";
import { Medicines } from "../models/Medicines";

class OrderController {

    public async createOrder(req: Request, res: Response) {

        // Recuperar o token
        const token = req.body.token || req.query.token || req.headers['auth']
        console.log("token", token)

        // Decodificar pra conseguir pegar o usuário da sessão
        let decodeToken : any = jwt.decode(token)

        //Get parameters from the body
        let { itemName, qnty, motive } = req.body;

        let order = new Order();

        order.askedBy = decodeToken.username;
        order.itemName = itemName;
        order.qnty = qnty;
        order.motive = motive;
        order.status = "PENDING";
        order.dateRegister = moment().format('YYYY-MM-DD HH:mm:ss');

        try {
            const OrderRepository = getRepository(Order);

            const newOrder = await OrderRepository.save(order);

            //If all ok, send 201 response
            return res.status(201).send(newOrder);
        } catch (error) {
            return res.status(400).send({
                dataIsValid: false
            });
        }
    };

    public async findOrderPending(req: Request, res: Response) {
        //Get users from database
        const builder = getRepository(Order).createQueryBuilder('Order');

        builder.where({ status: "PENDING" })

        // APLICANDO ORDENAÇÃO DE DADOS PELO CAMPO NOME
        const sort: any = req.query.sort

        if (sort) {
            builder.orderBy('Order.userName', sort.toLowerCase())
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

    public async updatedOrderAndUpdatedMedicines(req: Request, res: Response) {
        //Get the ID from the url
        const id = req.params.id;

        // Recuperar o token
        const token = req.body.token || req.query.token || req.headers['auth']

        // Decodificar pra conseguir pegar o usuário da sessão
        let decodeToken : any = jwt.decode(token)

        //Get values from the body
        let order = new Order()
        // mudar para medicamentos
        let medicine = new Medicines()

        //Try to find user on database
        const orderRepository = getRepository(Order);
        //mudar para medicamentos
        const medicineRepository = getRepository(Medicines);

        try {
            order = await orderRepository.findOneOrFail({ where: { uuid: id } })
        } catch (error) {
            //If not found, send a 404 response
            return res.status(404).send({
                orderIsValid: false
            });
        }

        //Busco se o nome do produto a ser retirado da order corresponde ao nome do medicamento da tabela medicamentos
        //Mudar para o campo nome da tabela de medicamentos
        medicine = await medicineRepository.findOneBy({ name: order.itemName })

        // Se os nomes forem iguais eu faço a subtração da quantidade
        try {
            // mudar para medicamentos
            medicine.qnty = medicine.qnty - order.qnty
        } catch (e) {
            console.log(e);
            return res.status(502).send({
                itemNameIsValid: false
            });
        }

        medicine.dateUpdated = moment().format('YYYY-MM-DD HH:mm:ss')

        // E salvo a nova quantidade na tabela de medicamentos
        // mudar para medicamentos
        await medicineRepository.save(medicine)

        // Salvando items na tabela de orders
        order.approvedBy = decodeToken.username
        order.status = "AUTHORIZED"
        order.dateUpdated = moment().format('YYYY-MM-DD HH:mm:ss')

        //Try to safe, if it fails, an error was found trying to save in the database
        try {
            await orderRepository.save(order);
            //After all send a 204 (no content, but accepted) response
            return res.status(204).send();
        } catch (e) {
            console.log(e);
            return res.status(502).send({
                dataIsValid: false
            });
        }
    }

    public async repprovedOrder(req: Request, res: Response) {
        //Get the ID from the url
        const id = req.params.id;

        //Get values from the body
        let order = new Order()

        //Try to find user on database
        const orderRepository = getRepository(Order);

        try {
            order = await orderRepository.findOneOrFail({ where: { uuid: id } });
        } catch (error) {
            //If not found, send a 404 response
            return res.status(404).send("Order not found");
        }

        //Validate the new values on model
        order.status = "NOT_AUTHORIZED"
        order.deleted = true
        order.dateUpdated = moment().format('YYYY-MM-DD HH:mm:ss');

        //Try to safe, if it fails, an error was found trying to save in the database
        try {
            await orderRepository.save(order);
            //After all send a 204 (no content, but accepted) response
            return res.status(204).send();
        } catch (e) {
            console.log(e);
            return res.status(502).send({
                dataIsValid: false
            });
        }
    }

};

export default new OrderController();