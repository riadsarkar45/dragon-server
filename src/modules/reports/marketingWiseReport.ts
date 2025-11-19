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
    factoryName: string | null;
    dyeingSection: string | null;
};

type MarketingReport = {
    marketingName: string;
    totalOrderQty: number;
    factoryName: string | null;
    orderedYarns: YarnItem[];
    dyeingSection: string | null;
};

export const marketingWiseReport = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const cachedReport = req.server.cache.get("marketingReport")

        if(cachedReport){
            reply.send({
            success: true,
            data: cachedReport
        });
        }
        const summary = await prisma.dyeingOrders.findMany({
            select: {
                marketingName: true,
                factoryName: true,
                dyeingSection: true,
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
                    factoryName: order.factoryName,
                    dyeingSection: order.dyeingSection,
                    orderedYarns: []
                };
            }

            order.orderedYarns.forEach((oy) => {
                const qty = Number(oy.orderedYarnQty || "0") || 0;
                const yarnName = oy.yarnType?.yarnType ?? "Unknown";
                const factoryName = order.factoryName;
                const dyeingSection = order.dyeingSection
                reportMap[mName].orderedYarns.push({
                    yarn: yarnName,
                    qty,
                    factoryName,
                    dyeingSection
                    
                });

                reportMap[mName].totalOrderQty += qty;
            });
        });

        const result: MarketingReport[] = Object.values(reportMap);

        req.server.cache.set("marketingReport", result)

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
