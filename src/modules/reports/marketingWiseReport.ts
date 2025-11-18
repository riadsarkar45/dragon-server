import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../Prisma/prisma";

/**
 * Output shape:
 * [
 *   {
 *     marketingName: string;
 *     totalOrderQty: number;
 *     orderedYarns: { yarn: string; qty: number }[];
 *   }
 * ]
 */

type YarnItem = {
    yarn: string;
    qty: number;
};

type MarketingReport = {
    marketingName: string;
    totalOrderQty: number;
    orderedYarns: YarnItem[];
};

export const marketingWiseReport = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const summary = await prisma.dyeingOrders.findMany({
            select: {
                marketingName: true,
                orderedYarns: {
                    select: {
                        orderedYarnQty: true,
                        yarnType: {
                            select: {
                                yarnType: true
                            }
                        }
                    }
                }
            }
        });

        const reportMap: Record<string, MarketingReport> = {};

        summary.forEach((order) => {
            const mName = order.marketingName;
            if (!mName) return;

            if (!reportMap[mName]) {
                reportMap[mName] = {
                    marketingName: mName,
                    totalOrderQty: 0,
                    orderedYarns: []
                };
            }

            order.orderedYarns.forEach((oy) => {
                const qty = Number(oy.orderedYarnQty || "0") || 0;
                const yarnName = oy.yarnType?.yarnType ?? "Unknown";

                reportMap[mName].orderedYarns.push({
                    yarn: yarnName,
                    qty
                });

                reportMap[mName].totalOrderQty += qty;
            });
        });

        const result: MarketingReport[] = Object.values(reportMap);

        reply.send({
            success: true,
            data: result
        });
    } catch (err) {
        req.log.error({ err }, "Marketing wise report generation failed");
        reply.status(500).send({
            success: false,
            message: "Failed to generate marketing wise report."
        });
    }
};
