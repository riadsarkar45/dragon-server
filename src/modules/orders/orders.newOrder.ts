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
                        yarnTypeId: 1,
                        monthName: new Date().toLocaleString('en-US', { month: 'long' })
                    }
                }
            )

            const yarnTypeArray = yarnType.split(',').map(yt => yt.trim());

            const yarnTypeRows = [];
            for (const yt of yarnTypeArray) {
                const row = await tx.yarnTypes.upsert({
                    where: { yarnType: yt }, // yarnType column must be unique
                    update: {},
                    create: { yarnType: yt }
                });
                yarnTypeRows.push(row);
            }

            const dyeingOrderId = addNewOrder.id;
            const convertColorsStringToArray = colors.split(',').map(color => color.trim());

            await tx.colors.createMany({
                data: convertColorsStringToArray.map(color => ({
                    colors: color,
                    dyeingOrderId: dyeingOrderId,
                })),
            });

            const convertYarnTypeToArray = yarnType.split(',').map(yt => yt.trim());

            await tx.yarnTypes.createMany(
                {
                    data: convertYarnTypeToArray.map((yt) => (
                        {
                            yarnType: yt,
                            dyeingOrderId: dyeingOrderId
                        }
                    ))

                }
            )

            return addNewOrder;

        })

        if (!addNewOrders) {
            return reply.status(400).send({ message: "Something went wrong. Please don't try again latter." })
        }

        reply.status(200).send({ message: "New dyeing order created successfully" })
    } catch (e) {
        console.log(e);
    }



}