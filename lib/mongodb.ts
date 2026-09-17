/**
 * MongoDB singleton connection for Next.js
 *
 * Reuses a single MongoClient across all serverless invocations in dev
 * (via module-level cache on globalThis) and across requests in prod
 * (Vercel keeps function instances warm, so the cached client is reused).
 *
 * This eliminates the ~1500ms TCP+TLS+auth cold-start overhead on every request.
 */

import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI ?? "";
const DB_NAME = "portfolio";

// ── Singleton cache ───────────────────────────────────────────────────────────
declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (!uri) {
  // No URI — return a rejected promise so callers can handle gracefully
  clientPromise = Promise.reject(new Error("MONGODB_URI is not set"));
} else if (process.env.NODE_ENV === "development") {
  // In dev, use a global variable so the connection survives HMR reloads
  if (!global._mongoClientPromise) {
    global._mongoClient = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });
    global._mongoClientPromise = global._mongoClient.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, module scope is sufficient — Vercel keeps instances warm
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 10000,
  });
  clientPromise = client.connect();
}

export default clientPromise;

/**
 * Get a database instance from the shared connection pool.
 * This is fast after the first call because it reuses the existing connection.
 */
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

/**
 * Read a content document from the `content` collection.
 * Returns `null` if not found or on any error.
 */
export async function getContent(type: string): Promise<unknown | null> {
  try {
    const db = await getDb();
    const doc = await db.collection("content").findOne({ type });
    return doc?.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Write a content document to the `content` collection.
 */
export async function setContent(type: string, data: unknown): Promise<void> {
  const db = await getDb();
  await db.collection("content").updateOne(
    { type },
    { $set: { data, updatedAt: new Date() } },
    { upsert: true }
  );
}
