"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDyeingOrders = void 0;
const prisma_1 = __importDefault(require("../../Prisma/prisma"));
const getDyeingOrders = async (req, reply) => {
    const cachedDyeingOrders = req.server.cache.get("dyeingOrders");
    if (cachedDyeingOrders) {
        return reply.status(200).send({ dyeingOrders: cachedDyeingOrders });
    }
    const dyeingOrders = await prisma_1.default.dyeingOrders.findMany({
        select: {
            orderedYarns: true,
            marketingName: true,
            colors: true,
            merchentName: true,
            factoryName: true,
            dyeingSection: true,
            orderNo: true,
            orderQty: true,
            monthName: true,
            challans: {
                select: {
                    challanImage: true,
                    createdAt: true,
                }
            },
            user: {
                select: {
                    name: true,
                    userDesignation: true,
                    userRole: true,
                }
            }
        },
        orderBy: {
            orderNo: 'asc',
        }
    });
    req.server.cache.set("dyeingOrders", dyeingOrders, 300);
    if (!dyeingOrders)
        return reply.status(404).send({ message: "No dyeing order found." });
    reply.status(200).send({ dyeingOrders: dyeingOrders });
};
exports.getDyeingOrders = getDyeingOrders;
