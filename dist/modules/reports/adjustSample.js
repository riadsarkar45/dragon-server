"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustSample = void 0;
const prisma_1 = __importDefault(require("../../Prisma/prisma"));
const adjustSample = async (req, reply) => {
    const { selectOrderedYarnId } = req.body;
    if (Array.isArray(selectOrderedYarnId) && selectOrderedYarnId.length > 0) {
        const yarnIdsAsNumbers = selectOrderedYarnId.map(Number);
        const foundYarns = await prisma_1.default.orderedYarn.findMany({
            where: { id: { in: yarnIdsAsNumbers } },
            select: { id: true }
        });
        const foundIds = foundYarns.map(yarn => yarn.id);
        if (foundIds.length === 0) {
            return reply.status(404).send({ message: "None of the selected yarn IDs found" });
        }
        const updateResult = await prisma_1.default.orderedYarn.updateMany({
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
};
exports.adjustSample = adjustSample;
