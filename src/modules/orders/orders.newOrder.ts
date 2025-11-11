import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../Prisma/prisma";
import { dyeingOrder } from "../../types/types";

// colors: string;
//     dyeingOrderNumber: string;
//     dyeingSection: string;
//     factoryName: string;
//     marketingName: string;
//     merchantName: string;
//     orderQty: string;
//     yarnType: string;
//     createdAt: Date

export const createNewDyeingOrder = async (req: FastifyRequest<{ Body: dyeingOrder }>, reply: FastifyReply) => {
    const { colors, orderNo, dyeingSection, factoryName, marketingName, merchentName, marketingId, orderQty, yarnType } = req.body;

    const missingFields = [];

    if (!colors) missingFields.push('colors');
    if (!orderNo) missingFields.push('orderNo');
    if (!dyeingSection) missingFields.push('dyeingSection');
    if (!factoryName) missingFields.push('factoryName');
    if (!marketingName) missingFields.push('marketingName');
    if (!merchentName) missingFields.push('merchentName');
    // if (!marketingId) missingFields.push('marketingId');
    if (!orderQty) missingFields.push('orderQty');
    if (!yarnType) missingFields.push('yarnType');

    if (missingFields.length > 0) {
        return reply.status(400).send({
            message: `Missing required fields: ${missingFields.join(', ')}`
        });
    }

    try {


        const addNewOrders = await prisma.$transaction(async (tx) => {
            const addNewOrder = await tx.dyeingOrders.create(
                {
                    data: {
                        dyeingSection: dyeingSection,
                        orderNo: orderNo,
                        userId: 1,
                        factoryName: factoryName,
                        marketingName: marketingName,
                        merchentName: merchentName,
                        orderQty: orderQty,
                        yarnType: yarnType,
                        monthName: new Date().toLocaleString('en-US', { month: 'long' })
                    }
                }
            )
            const dyeingOrderId = addNewOrder.id; 
            const addColors = await tx.colors.createMany(
                {
                    data: {
                        colors: colors,
                        dyeingOrderId: dyeingOrderId,

                    }
                }
            )


        })

        // if (!addNewOrders.order) {
        //     return reply.status(400).send({ message: "Something went wrong. Please don't try again latter." })
        // }

        reply.status(200).send({ message: "New dyeing order created successfully" })
    } catch (e) {
        console.log(e);
    }



}