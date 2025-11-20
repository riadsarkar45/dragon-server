import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../Prisma/prisma";

type YarnItem = {
    yarn: string;
    qty: number;
    factoryName: string | null;
    dyeingSection: string | null;
    orderNo: string | null

};

type MarketingReport = {
    marketingName: string;
    totalOrderQty: number;
    factoryName: string | null;
    orderedYarns: YarnItem[];
    dyeingSection: string | null;
    orderNo: string | null

};

type FactoryReportItem = {
    yarn: string;
    qty: number;
    merchentName: string | null;  // Added merchant name to each yarn item
    marketingName: string | null; // Added marketing name to each yarn item
    orderNo: string | null

};

type FactoryReport = {
    factoryName: string | null;
    orderNo: string | null
    orderedYarns: FactoryReportItem[]; // Now contains detailed yarn items with merchant info

};

export const marketingWiseReport = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const summary = await prisma.dyeingOrders.findMany({
            select: {
                marketingName: true,
                factoryName: true,
                dyeingSection: true,
                merchentName: true,
                orderNo: true,
                orderedYarns: {
                    select: {
                        orderedYarnQty: true,
                        yarnType: { select: { yarnType: true } }
                    }
                }
            }
        });

        const marketingMap: Record<string, MarketingReport> = {};
        const factoryMap: Record<string, FactoryReport> = {};

        summary.forEach((order) => {
            const { marketingName, factoryName, orderNo, merchentName, dyeingSection } = order;
            if (!marketingName) return;

            // --- Marketing wise report ---
            if (!marketingMap[marketingName]) {
                marketingMap[marketingName] = {
                    marketingName,
                    factoryName,
                    dyeingSection,
                    totalOrderQty: 0,
                    orderedYarns: [],
                    orderNo
                };
            }

            // --- Factory wise KEY ---
            const factoryKey = factoryName || 'unknown_factory'; // Use factory name as key

            if (!factoryMap[factoryKey]) {
                factoryMap[factoryKey] = {
                    factoryName,
                    orderNo,
                    orderedYarns: []
                };
            }

            // Push yarns
            order.orderedYarns.forEach((oy) => {
                const qty = Number(oy.orderedYarnQty || "0") || 0;
                const yarn = oy.yarnType?.yarnType ?? "Unknown";

                // Marketing
                marketingMap[marketingName].orderedYarns.push({
                    yarn,
                    qty,
                    factoryName,
                    dyeingSection,
                    orderNo
                });
                marketingMap[marketingName].totalOrderQty += qty;

                // Factory wise - now grouped by factory with merchant and marketing info
                factoryMap[factoryKey].orderedYarns.push({
                    yarn,
                    qty,
                    merchentName,
                    marketingName,
                    orderNo
                });
            });
        });

        reply.send({
            success: true,
            marketingReport: Object.values(marketingMap),
            factoryReport: Object.values(factoryMap)
        });

    } catch (err) {
        req.log.error({ err }, "Marketing wise report generation failed");
        reply.status(500).send({
            success: false,
            message: "Failed to generate marketing wise report."
        });
    }
};