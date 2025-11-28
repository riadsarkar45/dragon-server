"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoutes = void 0;
const order_update_challan_1 = require("../../modules/orders/order.update.challan");
const adjustSample_1 = require("../../modules/reports/adjustSample");
const updateRoutes = (fastify) => {
    fastify.put('/dyeing-order/challan/:id', order_update_challan_1.updateDyeingOrderWithChallan);
    fastify.put('/sample-adjust', adjustSample_1.adjustSample);
};
exports.updateRoutes = updateRoutes;
