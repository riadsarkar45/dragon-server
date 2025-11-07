import { FastifyInstance } from "fastify";
import { createNewDyeingOrder } from "../modules/orders/orders.newOrder";
import { dyeingOrders } from "@prisma/client";

export const allRoutes = (fastify: FastifyInstance) => {

    fastify.post<{ Body: dyeingOrders }>('/neworder', {
        schema: {
            body: {
                type: 'object',

                required: [
                    "colors",
                    "orderNo",
                    "dyeingSection",
                    "factoryName",
                    "marketingName",
                    "merchentName",
                    "orderQty",
                    "yarnType"
                ],

                properties: {
                    colors: { type: 'string' },
                    orderNo: { type: 'string' },
                    dyeingSection: { type: "string" },
                    factoryName: { type: "string" },
                    marketingName: { type: "string" },
                    merchentName: { type: "string" },
                    orderQty: { type: "string" },
                    yarnType: { type: "string" }
                }
            }
        }
    }, createNewDyeingOrder)
}