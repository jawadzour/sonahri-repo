import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { Inquiry, InsertInquiry, inquiries } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(postgres(process.env.DATABASE_URL));
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function createInquiry(inquiry: InsertInquiry): Promise<Inquiry | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save inquiry: database not available");
    return null;
  }
  await db.insert(inquiries).values(inquiry);
  return null;
}

export async function listInquiries() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list inquiries: database not available");
    return [];
  }
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

export async function deleteInquiry(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(inquiries).where(eq(inquiries.id, id));
}

// Re-export type for convenience
export type { Inquiry } from "../drizzle/schema";
