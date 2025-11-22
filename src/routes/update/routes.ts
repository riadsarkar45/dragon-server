import { FastifyInstance } from "fastify";
import { updateDyeingOrderWithChallan } from "../../modules/orders/order.update.challan";
import { adjustSample } from "../../modules/reports/adjustSample";

export const updateRoutes = (fastify: FastifyInstance) => {
        fastify.put('/dyeing-order/challan/:id', updateDyeingOrderWithChallan);
        
        fastify.put('/sample-adjust/:yarnId', adjustSample);
}