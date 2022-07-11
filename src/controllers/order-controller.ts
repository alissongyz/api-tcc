import { Request, Response } from "express";
import { getRepository, Repository } from "typeorm";
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

        // Decodificar pra conseguir pegar o usuário da sessão
        let decodeToken: any = jwt.decode(token)

        const sessionUser = decodeToken.username
        const currentDate = moment().format("YYYY-MM-DD hh:mm:ss")
        const generateOrderNumber = Math.floor(Math.random() * 65536);

        for (const item in req.body.order) {

            console.log(`${moment().format("YYYY-MM-DD hh:mm:ss")} - Iniciando solicitação de pedido->`,
                req.body.order)

            let orders = {
                nroOrder: generateOrderNumber,
                requiredBy: sessionUser,
                itemName: req.body.order[item].itemName,
                qnty: req.body.order[item].qnty,
                motive: req.body.order[item].motive,
                status: "PENDING",
                dateRegister: currentDate
            }

            console.log(`${moment().format("YYYY-MM-DD hh:mm:ss")} - Montando o pedidos ->`,
                orders)

            const orderRepository = getRepository(Order)

            console.log(`${moment().format("YYYY-MM-DD hh:mm:ss")} - Enviando o pedido e salvando ->`,
                await orderRepository.save(orders))

            await orderRepository.save(orders)
        }

        return res.status(201).send({ orderCreated: true })
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

        return res.send(
            await builder.getMany(), // RETORNA TODOS OS ITEMS DO BANCO
        )
    }

    public async findOrderStatus(req: Request, res: Response) {
        //Get users from database
        const builder = getRepository(Order).createQueryBuilder('Order');

        builder.where({ status: "AUTHORIZED" }).orWhere({ status: "NOT_AUTHORIZED" })

        // APLICANDO ORDENAÇÃO DE DADOS PELO CAMPO NOME
        const sort: any = req.query.sort

        if (sort) {
            builder.orderBy('Order.userName', sort.toLowerCase())
        }

        return res.send(
            await builder.getMany(), // RETORNA TODOS OS ITEMS DO BANCO
        )
    }


    public async updatedOrderAndItems(req: Request, res: Response) {
        //Get the ID from the url
        const id = req.params.id;

        // Recuperar o token
        const token = req.body.token || req.query.token || req.headers['auth']

        // Decodificar pra conseguir pegar o usuário da sessão
        let decodeToken: any = jwt.decode(token)

        //Get values from the body
        let order = new Order()
        let medicine = new Medicines()
        let material = new Material()

        //Try to find user on database
        const orderRepository = getRepository(Order);
        const medicineRepository = getRepository(Medicines);
        const materialRepository = getRepository(Material);

        try {
            order = await orderRepository.findOneOrFail({ where: { uuid: id } })
        } catch (error) {
            //If not found, send a 404 response
            return res.status(404).send({
                orderIsValid: false
            });
        }

        if(medicine = await medicineRepository.findOneBy({ name: order.itemName })) {
            medicine.qnty = medicine.qnty - order.qnty

            medicine.dateUpdated = moment().format('YYYY-MM-DD HH:mm:ss')

            await medicineRepository.save(medicine)
        } else if(material = await materialRepository.findOneBy({ name: order.itemName })) {
            material.qnty = material.qnty - order.qnty

            material.dateUpdated = moment().format('YYYY-MM-DD HH:mm:ss')

            await materialRepository.save(material)
        }

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