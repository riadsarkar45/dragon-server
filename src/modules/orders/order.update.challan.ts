import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../Prisma/prisma";

interface Body {
    challanImages: string[];
}

export const updateDyeingOrderWithChallan = async (req: FastifyRequest<{ Body: Body }>, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const { challanImages } = req.body;

    try {

        const findDyeingOrder = await prisma.dyeingOrders.findFirst(
            {
                where: {
                    orderNo: id
                }
            }
        )

        if (!findDyeingOrder) {
            return reply.status(404).send({
                success: false,
                message: "Dyeing order not found",
            });
        }
        console.info(findDyeingOrder);

        const uploadChallanImageLinks = await prisma.challans.createMany({
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
    } catch (e) {
        console.log(e);
        return reply.status(500).send({
            success: false,
            message: "Something went wrong",
            error: e,
        });
    }
};
