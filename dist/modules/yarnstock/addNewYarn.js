"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewYarnStock = void 0;
const prisma_1 = __importDefault(require("../../Prisma/prisma"));
const addNewYarnStock = async (req, reply) => {
    const { yarnType, supplierName, receivedQty, challanNo } = req.body;
    if (!yarnType || !supplierName || !receivedQty || !challanNo) {
        return reply.status(400).send({
            message: 'All fields are required'
        });
    }
    const findYarnTypeIfExist = await prisma_1.default.yarnTypes.findUnique({
        where: { yarnType: yarnType }
    });
    if (findYarnTypeIfExist) {
        reply.status(401).send({ message: `${yarnType} already exist` });
        return;
    }
    const addNewYarn = await prisma_1.default.yarnTypes.create({
        data: {
            yarnType: yarnType,
            challanNo: challanNo,
            supplierName: supplierName,
            receivedQty: receivedQty
        }
    });
    if (!addNewYarn) {
        return reply.status(200).send({ message: "Something went wrong. Please try again later" });
    }
    reply.status(200).send({ message: "Yarn added Successfully" });
};
exports.addNewYarnStock = addNewYarnStock;
