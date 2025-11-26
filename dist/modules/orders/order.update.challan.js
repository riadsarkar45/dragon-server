"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDyeingOrderWithChallan = void 0;
const prisma_1 = __importDefault(require("../../Prisma/prisma"));
const updateDyeingOrderWithChallan = async (req, reply) => {
    const { id } = req.params;
    const { challanImages } = req.body;
    try {
        const findDyeingOrder = await prisma_1.default.dyeingOrders.findFirst({
            where: {
                orderNo: id
            }
        });
        if (!findDyeingOrder) {
            return reply.status(404).send({
                success: false,
                message: "Dyeing order not found",
            });
        }
        console.info(findDyeingOrder);
        const uploadChallanImageLinks = await prisma_1.default.challans.createMany({
            data: challanImages.map((urls) => ({
                dyeingOrderId: findDyeingOrder.id,
                challanImage: urls,
                dyeingOrderNo: id,
            })),
        });
        return reply.send({
            success: true,
            data: uploadChallanImageLinks,
        });
    }
    catch (e) {
        console.log(e);
        return reply.status(500).send({
            success: false,
            message: "Something went wrong",
            error: e,
        });
    }
};
exports.updateDyeingOrderWithChallan = updateDyeingOrderWithChallan;
