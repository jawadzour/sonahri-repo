import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Contact form submissions from the public website.
 */
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  inquiryType: varchar("inquiryType", { length: 64 }).default("general").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

/**
 * Public donation submissions (bank transfer / JazzCash / EasyPaisa).
 * Donors submit via the public /donate page; admins verify or reject
 * them from the admin dashboard.
 */
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  donorName: varchar("donorName", { length: 255 }).notNull(),
  donorEmail: varchar("donorEmail", { length: 320 }).notNull(),
  donorPhone: varchar("donorPhone", { length: 50 }).notNull(),
  amount: varchar("amount", { length: 32 }).notNull(),
  currency: varchar("currency", { length: 8 }).default("PKR").notNull(),
  program: varchar("program", { length: 255 }),
  message: text("message"),
  paymentMethod: varchar("paymentMethod", { length: 32 }).notNull(),
  transactionReference: varchar("transactionReference", { length: 255 }).notNull(),
  screenshotUrl: text("screenshotUrl"),
  status: varchar("status", { length: 16 }).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = typeof donations.$inferInsert;

// TODO: Add more tables here as your project grows (e.g. programs, projects, gallery images)