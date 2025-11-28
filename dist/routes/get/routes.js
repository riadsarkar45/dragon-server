"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutes = void 0;
const orders_get_1 = require("../../modules/orders/orders.get");
const marketingWiseReport_1 = require("../../modules/reports/marketingWiseReport");
const cacheReport_1 = require("../../plugins/caching/cacheReport");
const getRoutes = (fastify) => {
    fastify.get("/allorders", orders_get_1.getDyeingOrders);
    fastify.get("/report", marketingWiseReport_1.marketingWiseReport);
    fastify.get("/cachereport", cacheReport_1.cacheReport);
};
exports.getRoutes = getRoutes;
