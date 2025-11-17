import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../Prisma/prisma";
import { dyeingOrder } from "../../types/types";

export const createNewDyeingOrder = async (req: FastifyRequest<{ Body: dyeingOrder }>, reply: FastifyReply) => {
    const { colors, orderNo, dyeingSection, factoryName, marketingName, merchentName, marketingId, orderQty, yarnType } = req.body;

    const missingFields = [];
    console.log(yarnType);
    if (!colors) missingFields.push('colors');
    if (!orderNo) missingFields.push('orderNo');
    if (!dyeingSection) missingFields.push('dyeingSection');
    if (!factoryName) missingFields.push('factoryName');
    if (!marketingName) missingFields.push('marketingName');
    if (!merchentName) missingFields.push('merchentName');
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
                        userId: 3,
                        factoryName: factoryName,
                        marketingName: marketingName,
                        merchentName: merchentName,
                        orderQty: orderQty,
                        monthName: new Date().toLocaleString('en-US', { month: 'long' })
                    }
                }
            )

            const checkMultipleYarnIfExist = yarnType
                .split(",")
                .map((yarn) => yarn.trim());

            const checkOrderYarnIfExist = await tx.yarnTypes.findMany({
                where: { yarnType: { in: checkMultipleYarnIfExist } }
            });

            const convertLBSintoArray = orderQty.split(',').map(qty => qty.trim());

            if (checkOrderYarnIfExist.length === 0) return;
            const dyeingOrderId = addNewOrder.id;

            await tx.orderedYarn.createMany({
                data:
                    checkMultipleYarnIfExist.map((yn, index) => ({
                        yarnTypes: yn,
                        dyeingOrderId: dyeingOrderId,
                        orderedYarnQty: convertLBSintoArray[index],
                        yarnTypeId: checkOrderYarnIfExist.find(y => y.yarnType === yn)?.id || 0
                    }))
            });

            const convertColorsStringToArray = colors.split(',').map(color => color.trim());

            await tx.colors.createMany({
                data: convertColorsStringToArray.map(color => ({
                    colors: color,
                    dyeingOrderId: dyeingOrderId,
                })),
            });

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