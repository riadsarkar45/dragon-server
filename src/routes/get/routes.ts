import { FastifyInstance } from "fastify";
import { getDyeingOrders } from "../../modules/orders/orders.get";
import { marketingWiseReport } from "../../modules/reports/marketingWiseReport";
import { cacheReport } from "../../plugins/caching/cacheReport";

export const getRoutes = (fastify: FastifyInstance) => {

    fastify.get("/allorders", getDyeingOrders)

    fastify.get("/report", marketingWiseReport)

    fastify.get("/cachereport", cacheReport)

}