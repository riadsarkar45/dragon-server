import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../Prisma/prisma";

export const getDyeingOrders = async (req: FastifyRequest, reply: FastifyReply) => {

    const cachedDyeingOrders = req.server.cache.get("dyeingOrders")
    if (cachedDyeingOrders) {
        return reply.status(200).send({ dyeingOrders: cachedDyeingOrders })

    }
    const dyeingOrders = await prisma.dyeingOrders.findMany(
        {
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
        }
    )

    req.server.cache.set("dyeingOrders", dyeingOrders, 300)

    if (!dyeingOrders) return reply.status(404).send({ message: "No dyeing order found." })

    reply.status(200).send({ dyeingOrders: dyeingOrders })
}