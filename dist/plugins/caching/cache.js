"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/plugins/cache.ts
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const node_cache_1 = __importDefault(require("node-cache"));
const cachePlugin = (0, fastify_plugin_1.default)(async (fastify, options = {}) => {
    const cache = new node_cache_1.default({
        stdTTL: options.stdTTL || 600, // 10 minutes default
        checkperiod: options.checkperiod || 120,
        useClones: options.useClones !== undefined ? options.useClones : true,
    });
    fastify.decorate('cache', cache);
});
exports.default = cachePlugin;
