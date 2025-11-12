import { FastifyInstance } from "fastify";
import { createNewDyeingOrder } from "../modules/orders/orders.newOrder";
import { createNewUser } from "../modules/users/createNewUser";
import { userLogin } from "../modules/users/login";
import { addNewYarnStock } from "../modules/yarnstock/addNewYarn";

export const allRoutes = (fastify: FastifyInstance) => {

    fastify.post('/neworder', {
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
    }, createNewDyeingOrder) // this route is for creating new dyeing order

    fastify.post("/newprofile", {
        schema: {
            body: {
                type: "object",

                required: ["userName", "userDesignation", "userRole", "userEmail", "userPassword"],

                properties: {
                    userName: { type: "string" },
                    userDesignation: { type: "string" },
                    userRole: { type: "string" },
                    userEmail: { type: "string" },
                    userPassword: { type: "string" },
                }
            }
        }
    }, createNewUser) // this route is for creating new profile

    fastify.post("/newshipped", {
        schema: {
            type: "object",
            body: {
                type: "object",
                required: ["yarnType", "receivedQty", "supplierName", "challanNo"],

                properties: {
                    yarnType: { type: "string" },
                    receivedQty: { type: "string" },
                    supplierName: { type: "string" },
                    challanNo: { type: "string" }
                }
            }
        }
    }, addNewYarnStock) // this route update new received yarn with qty

    fastify.post("/login", {
        schema: {
            body: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string" },
                    password: { type: "string" },
                }
            }
        }
    }, userLogin) // user login route
}