// src/plugins/cache.ts
import fp from 'fastify-plugin';
import NodeCache from 'node-cache';

// Define the cache type
declare module 'fastify' {
  interface FastifyInstance {
    cache: NodeCache;
  }
}

export interface CachePluginOptions {
  stdTTL?: number;
  checkperiod?: number;
  useClones?: boolean;
  errorOnMissing?: boolean;
  deleteOnExpire?: boolean;
}

const cachePlugin = fp(async (fastify, options: CachePluginOptions = {}) => {
  const cache = new NodeCache({
    stdTTL: options.stdTTL || 600, // 10 minutes default
    checkperiod: options.checkperiod || 120,
    useClones: options.useClones !== undefined ? options.useClones : true,
  });

  fastify.decorate('cache', cache);

});

export default cachePlugin;