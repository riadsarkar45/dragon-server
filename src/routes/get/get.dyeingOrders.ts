import { FastifyInstance } from "fastify";
import { getDyeingOrders } from "../../modules/orders/orders.get";
import { marketingWiseReport } from "../../modules/reports/marketingWiseReport";

export const getRoutes = (fastify: FastifyInstance) => {

    fastify.get("/allorders", getDyeingOrders)

    fastify.get("/report", marketingWiseReport)

}