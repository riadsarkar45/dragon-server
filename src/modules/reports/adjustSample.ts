import { FastifyReply, FastifyRequest } from "fastify";
import { sampleAdjustParams } from "../../types/types";
import prisma from "../../Prisma/prisma";

export const adjustSample = async (req: FastifyRequest<{ Body: sampleAdjustParams }>, reply: FastifyReply) => {
    const { selectOrderedYarnId } = req.body;

    if (Array.isArray(selectOrderedYarnId) && selectOrderedYarnId.length > 0) {
        const yarnIdsAsNumbers = selectOrderedYarnId.map(Number);

        const foundYarns = await prisma.orderedYarn.findMany({
            where: { id: { in: yarnIdsAsNumbers } },
            select: { id: true }
        });

        const foundIds = foundYarns.map(yarn => yarn.id);

        if (foundIds.length === 0) {
            return reply.status(404).send({ message: "None of the selected yarn IDs found" });
        }

        const updateResult = await prisma.orderedYarn.updateMany({
            where: { id: { in: foundIds } },
            data: { status: 'ADJUSTED' }
        });

        const notFoundIds = yarnIdsAsNumbers.filter(id => !foundIds.includes(id));

        return reply.status(200).send({
            message: `Updated ${updateResult.count} yarn(s) successfully`,
            notFoundIds: notFoundIds.length > 0 ? notFoundIds : undefined
        });
    }

    return reply.status(400).send({ message: "No yarn selected to adjust" });
}

