"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRoutes = void 0;
const orders_newOrder_1 = require("../../modules/orders/orders.newOrder");
const createNewUser_1 = require("../../modules/users/createNewUser");
const login_1 = require("../../modules/users/login");
const addNewYarn_1 = require("../../modules/yarnstock/addNewYarn");
const upload_1 = require("../../fileUpload/upload");
const generatePI_1 = require("../../modules/pdf/generatePI");
const allRoutes = (fastify) => {
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
    }, orders_newOrder_1.createNewDyeingOrder); // this route is for creating new dyeing order
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
    }, createNewUser_1.createNewUser); // this route is for creating new profile
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
    }, addNewYarn_1.addNewYarnStock); // this route update new received yarn with qty
    fastify.post("/fileupload", upload_1.multiFileUpload); // file upload route
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
    }, login_1.userLogin); // user login route
    fastify.post("/generate-pi", {
        schema: {
            body: {
                type: "object",
                required: ["buyerName"],
                properties: {
                    buyerName: { type: "string" }
                }
            }
        }
    }, generatePI_1.generatePI);
};
exports.allRoutes = allRoutes;
