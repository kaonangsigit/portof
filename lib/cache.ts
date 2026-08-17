/**
 * Caching utilities for improving performance and reducing API calls
 * Provides in-memory and file-based caching with TTL support
 */

import { logger } from "@/lib/logger";

type CacheValue<T> = {
  value: T;
  timestamp: number;
  ttl?: number;
  key?: string;
};

type CacheOptions = {
  ttl?: number;
  maxSize?: number;
  keyPrefix?: string;
};

class MemoryCache {
  private cache = new Map<string, CacheValue<any>>();
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 0,
      maxSize: options.maxSize || Infinity,
      keyPrefix: options.keyPrefix || "",
    };
  }

  private getKey(key: string): string {
    return this.options.keyPrefix ? `${this.options.keyPrefix}:${key}` : key;
  }

  private isExpired(value: CacheValue<any>): boolean {
    if (!value.ttl) return false;
    return Date.now() - value.timestamp > value.ttl;
  }

  private cleanupExpired(): void {
    for (const [key, value] of this.cache.entries()) {
      if (this.isExpired(value)) {
        this.cache.delete(key);
      }
    }
  }

  private enforceSizeLimit(): void {
    if (this.cache.size > this.options.maxSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toRemove = entries.slice(0, this.cache.size - this.options.maxSize);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  set<T>(key: string, value: T, ttl?: number): void {
    const cacheKey = this.getKey(key);
    const options = { ttl: ttl !== undefined ? ttl : this.options.ttl };
    
    this.cleanupExpired();
    
    this.cache.set(cacheKey, {
      value,
      timestamp: Date.now(),
      ttl: options.ttl,
      key: cacheKey,
    });
    
    this.enforceSizeLimit();
    
    logger.debug("Cache set", { key: cacheKey, ttl: options.ttl });
  }

  get<T>(key: string): T | null {
    const cacheKey = this.getKey(key);
    const value = this.cache.get(cacheKey);
    
    if (!value) {
      logger.debug("Cache miss", { key: cacheKey });
      return null;
    }
    
    if (this.isExpired(value)) {
      this.cache.delete(cacheKey);
      logger.debug("Cache expired", { key: cacheKey });
      return null;
    }
    
    logger.debug("Cache hit", { key: cacheKey });
    return value.value as T;
  }

  has(key: string): boolean {
    const cacheKey = this.getKey(key);
    const value = this.cache.get(cacheKey);
    
    if (!value) return false;
    
    if (this.isExpired(value)) {
      this.cache.delete(cacheKey);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    const cacheKey = this.getKey(key);
    return this.cache.delete(cacheKey);
  }

  clear(): void {
    this.cache.clear();
    logger.debug("Cache cleared");
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys()).map(key => 
      this.options.keyPrefix ? key.replace(`${this.options.keyPrefix}:`, "") : key
    );
  }

  values(): any[] {
    return Array.from(this.cache.values()).map(v => v.value);
  }

  entries(): Array<{ key: string; value: any; timestamp: number; ttl?: number }> {
    return Array.from(this.cache.entries()).map(([key, value]) => ({
      key: this.options.keyPrefix ? key.replace(`${this.options.keyPrefix}:`, "") : key,
      value: value.value,
      timestamp: value.timestamp,
      ttl: value.ttl,
    }));
  }
}

export type { CacheOptions, CacheValue };
export { MemoryCache };

class CacheManager {
  private static instance: CacheManager;
  private caches = new Map<string, MemoryCache>();

  private constructor() {}

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  createCache(name: string, options: CacheOptions = {}): MemoryCache {
    const cache = new MemoryCache(options);
    this.caches.set(name, cache);
    logger.info("Cache created", { name, options });
    return cache;
  }

  getCache(name: string): MemoryCache | undefined {
    return this.caches.get(name);
  }

  removeCache(name: string): boolean {
    const result = this.caches.delete(name);
    if (result) {
      logger.info("Cache removed", { name });
    }
    return result;
  }

  clearAll(): void {
    this.caches.forEach((cache, name) => {
      cache.clear();
      logger.info("Cache cleared", { name });
    });
    this.caches.clear();
    logger.info("All caches cleared");
  }

  getAllStats(): Array<{ name: string; size: number; keys: string[] }> {
    return Array.from(this.caches.entries()).map(([name, cache]) => ({
      name,
      size: cache.size(),
      keys: cache.keys(),
    }));
  }
}

export const cacheManager = CacheManager.getInstance();

// Convenience functions for common cache operations
export async function cachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  cacheOptions?: {
    ttl?: number;
    cacheName?: string;
    skipCache?: boolean;
  }
): Promise<T> {
  const { ttl, cacheName = "default", skipCache = false } = cacheOptions || {};
  const cache = cacheManager.getCache(cacheName);
  
  if (!skipCache && cache) {
    const cached = cache.get<T>(key);
    if (cached !== null) {
      logger.debug("Returning cached data", { key, cacheName });
      return cached;
    }
  }
  
  const data = await fetchFn();
  
  if (!skipCache && cache) {
    cache.set(key, data, ttl);
    logger.debug("Cached data", { key, cacheName, ttl });
  }
  
  return data;
}

export function createCache(name: string, options?: CacheOptions): MemoryCache {
  return cacheManager.createCache(name, options);
}

export function getCacheStats(): Array<{ name: string; size: number; keys: string[] }> {
  return cacheManager.getAllStats();
}

export function clearCache(name?: string): void {
  if (name) {
    cacheManager.removeCache(name);
  } else {
    cacheManager.clearAll();
  }
}