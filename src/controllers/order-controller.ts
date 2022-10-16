import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as moment from "moment";
import * as jwt from "jsonwebtoken";

import { Order } from "../models/Order";
import { Material } from "../models/Material";
import { Medicines } from "../models/Medicines";

export class OrderController {

    public async createOrderMultiple(req: Request, res: Response) {

        // Recuperar o token
        const token = req.body.token || req.query.token || req.headers['x-access-token']

        // Decodificar pra conseguir pegar o usuário da sessão
        let decodeToken: any = jwt.decode(token)

        const sessionUser = decodeToken.username
        const currentDate = moment().format("YYYY-MM-DD hh:mm:ss")
        const generateOrderNumber = Math.floor(Math.random() * 65536);

        for (const item in req.body.itemsMedicine) {

            console.log(`${moment().format("YYYY-MM-DD hh:mm:ss")} - Iniciando solicitação de pedido->`,
                req.body.itemsMedicine)

            let medicineOrders = {
                nroOrder: generateOrderNumber,
                requiredBy: sessionUser,
                itemName: req.body.itemsMedicine[item].itemName,
                qnty: req.body.itemsMedicine[item].qnty,
                motive: req.body.motive,
                status: "PENDING",
                dateRegister: currentDate
            }

            console.log(`${moment().format("YYYY-MM-DD hh:mm:ss")} - Montando os pedidos ->`,
                medicineOrders)

            const orderRepository = getRepository(Order)

            console.log(`${moment().format("YYYY-MM-DD hh:mm:ss")} 
                - Enviando o pedido e salvando ->`,
                await orderRepository.save(medicineOrders)
            )

            await orderRepository.save(medicineOrders)
        }

        for (const item in req.body.itemsMaterial) {

            console.log(`${moment().format("YYYY-MM-DD hh:mm:ss")} - Iniciando solicitação de pedido->`,
                req.body.itemsMaterial)

            let materialOrders = {
                nroOrder: generateOrderNumber,
                requiredBy: sessionUser,
                itemName: req.body.itemsMaterial[item].itemName,
                qnty: req.body.itemsMaterial[item].qnty,
                motive: req.body.motive,
                status: "PENDING",
                dateRegister: currentDate
            }

            console.log(`${moment().format("YYYY-MM-DD hh:mm:ss")} - Montando os pedidos ->`,
                materialOrders)

            const orderRepository = getRepository(Order)

            console.log(`${moment().format("YYYY-MM-DD hh:mm:ss")} - Enviando o pedido e salvando ->`,
                await orderRepository.save(materialOrders))

            await orderRepository.save(materialOrders)
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
        const builder = getRepository(Order).createQueryBuilder('order');

        builder.where({ status: "AUTHORIZED" }).orWhere("order.status = :status", { status: "NOT_AUTHORIZED" })

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
        const token = req.body.token || req.query.token || req.headers['x-access-token']

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

        // Regra de atualização de um medicamento/material
        if (medicine = await medicineRepository.findOne({ name: order.itemName })) {
            if (medicine.qnty >= order.qnty) {
                medicine.qnty = medicine.qnty - order.qnty

                medicine.dateUpdated = new Date();

                await medicineRepository.save(medicine)
            } else {
                return res.status(400).send({
                    medicineQnty: false
                })
            }

        } else if (material = await materialRepository.findOne({ name: order.itemName })) {
            if (material.qnty >= order.qnty) {
                material.qnty = material.qnty - order.qnty

                material.dateUpdated = new Date()

                await materialRepository.save(material)
            } else {
                return res.status(400).send({
                    materialQnty: false
                })
            }

        } else {
            return res.status(400).send({
                itemNotFound: true
            });
        }

        // Salvando items na tabela de orders
        order.approvedBy = decodeToken.username
        order.status = "AUTHORIZED"
        order.dateUpdated = new Date()

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
        order.dateUpdated = new Date();

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