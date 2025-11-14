import { FastifyInstance } from "fastify";
import { getDyeingOrders } from "../../modules/orders/orders.get";

export const getRoutes = (fastify: FastifyInstance) => {

    fastify.get("/allorders", getDyeingOrders)

}