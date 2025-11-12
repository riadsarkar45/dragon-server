import { FastifyReply, FastifyRequest } from "fastify";
import { yarnStockPayload } from "../../types/types";
import prisma from "../../Prisma/prisma";

export const addNewYarnStock = async (req: FastifyRequest<{ Body: yarnStockPayload }>, reply: FastifyReply) => {
    const { yarnType, supplierName, receivedQty, challanNo } = req.body;

    if (!yarnType || !supplierName || !receivedQty || !challanNo) {
        return reply.status(400).send({
            message: 'All fields are required'
        });
    }

    const findYarnTypeIfExist = await prisma.yarnTypes.findUnique(
        {
            where: { yarnType: yarnType }
        }
    )

    if (findYarnTypeIfExist) {
        reply.status(401).send({ message: `${yarnType} already exist` })

        return;
    }

    const addNewYarn = await prisma.yarnTypes.create(
        {
            data: {
                yarnType: yarnType,
                challanNo: challanNo,
                supplierName: supplierName,
                receivedQty: receivedQty
            }
        }
    )

    if (!addNewYarn) {
        return reply.status(200).send({ message: "Something went wrong. Please try again later" })
    }

    reply.status(200).send({ message: "Yarn added Successfully" })

}