import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../Prisma/prisma";

type OrderedYarn = {
    orderedYarnQty: number | string;
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
    yarnType: string | null;
};

export const marketingWiseReport = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const report = await prisma.users.findMany({
            select: {
                name: true,
                orders: {
                    select: {
                        id: true,
                        dyeingSection: true,
                        marketingName: true,  
                        orderedYarns: {
                            select: {
                                orderedYarnQty: true,
                                yarnType: true,
                            }
                        },
                    }
                },
            },
        });

        const sectionWiseReport = [] as ResultItem[];

        report.forEach(user => {
            user.orders.forEach(dyeingOrders => {
                dyeingOrders.orderedYarns.forEach(yarn => {

                    const existingSection = sectionWiseReport.find(
                        item => item.marketingName === dyeingOrders.marketingName
                    );

                    if (existingSection) {
                        existingSection.totalLbs += Number(yarn.orderedYarnQty);
                    } else {
                        sectionWiseReport.push({
                            dyeingSection: dyeingOrders.dyeingSection,
                            marketingName: dyeingOrders.marketingName,
                            count: 1,
                            totalLbs: Number(yarn.orderedYarnQty),
                            yarnType: yarn.yarnType.yarnType || null,
                        });
                    }
                });
            });
        });


        reply.send({
            success: true,
            data: {sectionWiseReport, report},
        });
    } catch (err) {
        req.log.error({ err }, "Marketing wise report generation failed");
        reply.status(500).send({
            success: false,
            message: "Failed to generate marketing wise report. Please try again later.",
        });
    }
};
