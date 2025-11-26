"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketingWiseReport = void 0;
const prisma_1 = __importDefault(require("../../Prisma/prisma"));
const marketingWiseReport = async (req, reply) => {
    try {
        const summary = await prisma_1.default.dyeingOrders.findMany({
            select: {
                marketingName: true,
                factoryName: true,
                dyeingSection: true,
                merchentName: true,
                orderNo: true,
                orderedYarns: {
                    select: {
                        orderedYarnQty: true,
                        unitPrice: true,
                        status: true,
                        id: true,
                        yarnType: { select: { yarnType: true } }
                    }
                }
            }
        });
        const marketingMap = {};
        const factoryMap = {};
        summary.forEach((order) => {
            const { marketingName, factoryName, orderNo, merchentName, dyeingSection } = order;
            if (!marketingName)
                return;
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
                    id: oy.id,
                    yarn,
                    qty,
                    merchentName,
                    marketingName,
                    orderNo,
                    unitPrice: oy.unitPrice,
                    status: oy.status,
                });
            });
        });
        reply.send({
            success: true,
            marketingReport: Object.values(marketingMap),
            factoryReport: Object.values(factoryMap)
        });
    }
    catch (err) {
        req.log.error({ err }, "Marketing wise report generation failed");
        reply.status(500).send({
            success: false,
            message: "Failed to generate marketing wise report."
        });
    }
};
exports.marketingWiseReport = marketingWiseReport;
