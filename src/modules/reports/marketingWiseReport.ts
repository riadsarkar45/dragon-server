import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../Prisma/prisma";

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

type FactoryReportItem = {
    yarn: string;
    qty: number;
};

type FactoryReport = {
    factoryName: string | null;
    merchentName: string | null;
    marketingName: string | null;
    dyeingSection: string | null;
    totalOrderQty: number;
    orderedYarns: FactoryReportItem[];
};

export const marketingWiseReport = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const summary = await prisma.dyeingOrders.findMany({
            select: {
                marketingName: true,
                factoryName: true,
                dyeingSection: true,
                merchentName: true,
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
            const { marketingName, factoryName, merchentName, dyeingSection } = order;
            if (!marketingName) return;

            // --- Marketing wise report ---
            if (!marketingMap[marketingName]) {
                marketingMap[marketingName] = {
                    marketingName,
                    factoryName,
                    dyeingSection,
                    totalOrderQty: 0,
                    orderedYarns: []
                };
            }

            // --- Factory wise KEY ---
            const factoryKey = `${factoryName}-${merchentName}`;

            if (!factoryMap[factoryKey]) {
                factoryMap[factoryKey] = {
                    factoryName,
                    merchentName,
                    marketingName,
                    dyeingSection,
                    totalOrderQty: 0,
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
                    dyeingSection
                });
                marketingMap[marketingName].totalOrderQty += qty;

                // Factory wise
                factoryMap[factoryKey].orderedYarns.push({
                    yarn,
                    qty
                });
                factoryMap[factoryKey].totalOrderQty += qty;
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
