import { FastifyReply, FastifyRequest } from "fastify";
import { sampleAdjustParams } from "../../types/types";
import prisma from "../../Prisma/prisma";

export const adjustSample = async (req: FastifyRequest<{ Params: sampleAdjustParams }>, reply: FastifyReply) => {
    const { yarnId } = req.params;
    
    const convertYarnIdToNumber = Number(yarnId)

    const findOrderedYarnIdBeforeUpdate = await prisma.orderedYarn.findUnique(
        {
            where: { id: convertYarnIdToNumber }
        }
    )

    if (!findOrderedYarnIdBeforeUpdate) {
        return reply.status(404).send({ message: "Order yarn id was not found." })
    }


    const updateOrderedYarnsStatus = await prisma.orderedYarn.update(
        {
            where: { id: convertYarnIdToNumber },
            data: {
                status: 'ADJUSTED'
            }

        }
    )

    if (!updateOrderedYarnsStatus) {
        return reply.status(400).send({ message: "Something went wrong. Please don't try again latter." })

    }

    reply.status(200).send({ message: "Ordered yarn status updated successfully" })

}