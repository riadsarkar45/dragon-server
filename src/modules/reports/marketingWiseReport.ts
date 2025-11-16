import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../Prisma/prisma";

type OrderedYarn = {
    orderedYarnQty: number | string; // যদি DB এ string থাকে
};

type DyeingOrderReport = {
    marketingName: string;
    dyeingSection: string;
    orderedYarns: OrderedYarn[];
};

type ResultItem = {
    marketingName: string;
    dyeingSection: string;
    totalLbs: number;
    count: number;
};

export const marketingWiseReport = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const report: DyeingOrderReport[] = await prisma.dyeingOrders.findMany({
            select: {
                marketingName: true,
                dyeingSection: true,
                orderedYarns: {
                    select: {
                        orderedYarnQty: true, // corrected field name
                    },
                },
            },
        });

        const result: Record<string, ResultItem> = {};

        report.forEach(order => {
            const key = `${order.marketingName}-${order.dyeingSection}`;
            const totalLbs = order.orderedYarns.reduce(
                (sum, y) => sum + Number(y.orderedYarnQty),
                0
            );

            if (!result[key]) {
                result[key] = {
                    marketingName: order.marketingName,
                    dyeingSection: order.dyeingSection,
                    totalLbs: 0,
                    count: 0,
                };
            }

            result[key].totalLbs += totalLbs;
            result[key].count += 1;
        });

        const finalReport: ResultItem[] = Object.values(result);
        reply.send({
            success: true,
            data: finalReport,
        });
    } catch (err) {
        req.log.error({ err }, "Marketing wise report generation failed");
        reply.status(500).send({
            success: false,
            message: "Failed to generate marketing wise report. Please try again later.",
        });
    }
};
