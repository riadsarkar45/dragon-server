import { FastifyInstance } from "fastify";
import { updateDyeingOrderWithChallan } from "../../modules/orders/order.update.challan";

export const updateRoutes = (fastify: FastifyInstance) => {
        fastify.put('/dyeing-order/challan/:id', updateDyeingOrderWithChallan )
}