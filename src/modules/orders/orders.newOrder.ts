import { FastifyReply, FastifyRequest } from "fastify";
import { dyeingOrder } from "../../types/types";
import { orderRepository } from "./orders.repository";


export const createNewDyeingOrder = async (req: FastifyRequest<{ Body: dyeingOrder }>, reply: FastifyReply) => {
    const { orderNo, orderQty, yarnType, marketingName, monthName } = req.body;

    if (!orderNo && !orderQty && !yarnType && !marketingName && !monthName) {
        return reply.status(400).send({ message: 'All fields are required' })
    }

    const addNewOrder = await orderRepository.createOrder(req.body)

    if (!addNewOrder) {
        return reply.status(400).send({ message: "Something went wrong. Please don't try again latter." })
    }

    reply.status(200).send({ message: "New dyeing order created successfully" })
}