/**
 * Type-safe API fetcher utility
 * Replaces basic fetch usage with enhanced error handling, retry logic, and TypeScript safety
 */

import { logger } from "@/lib/logger";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  cache?: "default" | "no-store" | "force-cache" | "only-if-cached" | "reload";
}

interface FetchResponse<T> {
  data: T;
  status: number;
  headers: Headers;
  ok: boolean;
  error?: string;
}

class FetchError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = "FetchError";
  }
}

function isResponseOk(response: Response): boolean {
  return response.status >= 200 && response.status < 300;
}

function mergeHeaders(
  defaultHeaders: Record<string, string> = {},
  customHeaders: Record<string, string> = {}
): HeadersInit {
  const headers = new Headers();
  
  Object.entries(defaultHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
  
  Object.entries(customHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
  
  return headers;
}

function normalizeUrl(url: string, baseUrl?: string): string {
  if (url.startsWith("/")) {
    return baseUrl ? `${baseUrl}${url}` : url;
  }
  return url;
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetcher<T = any>(
  url: string,
  options?: FetchOptions
): Promise<FetchResponse<T>> {
  const {
    timeout = 10000,
    retries = 3,
    retryDelay = 1000,
    headers = {},
    cache = "default",
    ...fetchOptions
  } = options || {};

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const startUrl = normalizeUrl(url);
  const requestHeaders = mergeHeaders(
    {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    headers
  );

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(startUrl, {
        ...fetchOptions,
        headers: requestHeaders,
        signal: controller.signal,
        cache,
      });

      clearTimeout(timeoutId);

      if (!isResponseOk(response)) {
        const errorMessage = `Request failed: ${response.status} ${response.statusText}`;
        
        if (response.status >= 500 && attempt < retries) {
          lastError = new FetchError(errorMessage, response.status, response);
          logger.warn(`Request failed (attempt ${attempt + 1}/${retries + 1}), retrying...`, {
            status: response.status,
            url: startUrl,
          });
          await delay(retryDelay * (attempt + 1));
          continue;
        }
        
        throw new FetchError(errorMessage, response.status, response);
      }

      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json() as T;
        return {
          data,
          status: response.status,
          headers: response.headers,
          ok: true,
        };
      } else {
        const text = await response.text();
        logger.warn("Response is not JSON", { contentType, status: response.status });
        
        try {
          const data = JSON.parse(text) as T;
          return {
            data,
            status: response.status,
            headers: response.headers,
            ok: true,
          };
        } catch {
          return {
            data: text as any,
            status: response.status,
            headers: response.headers,
            ok: true,
          };
        }
      }

    } catch (error) {
      clearTimeout(timeoutId);
      
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < retries && !controller.signal.aborted) {
        logger.warn(`Request error (attempt ${attempt + 1}/${retries + 1}), retrying...`, {
          error: error instanceof Error ? error.message : String(error),
          url: startUrl,
        });
        await delay(retryDelay * (attempt + 1));
        continue;
      }
      
      throw new FetchError(
        `Request failed after ${retries} retries: ${lastError.message}`, undefined, undefined
      );
    }
  }

  throw lastError || new FetchError("Request failed");
}

// Convenience methods
export async function get<T = any>(url: string, options?: FetchOptions): Promise<FetchResponse<T>> {
  return fetcher<T>(url, { ...options, method: "GET" });
}

export async function post<T = any>(
  url: string,
  data?: any,
  options?: FetchOptions
): Promise<FetchResponse<T>> {
  return fetcher<T>(url, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function put<T = any>(
  url: string,
  data?: any,
  options?: FetchOptions
): Promise<FetchResponse<T>> {
  return fetcher<T>(url, {
    ...options,
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function del<T = any>(url: string, options?: FetchOptions): Promise<FetchResponse<T>> {
  return fetcher<T>(url, { ...options, method: "DELETE" });
}

export { FetchError, type FetchResponse };