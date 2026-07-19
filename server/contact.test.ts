import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
      cookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: { email: "admin@example.com", role: "admin" },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
      cookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("contact.submitInquiry", () => {
  it("accepts valid contact inquiry", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submitInquiry({
      name: "John Doe",
      email: "john@example.com",
      phone: "+92-333-1234567",
      subject: "Partnership Inquiry",
      message: "I am interested in partnering with SHDS on education programs.",
      inquiryType: "partnership",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBeDefined();
  });

  it("rejects inquiry with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submitInquiry({
        name: "John Doe",
        email: "invalid-email",
        subject: "Test",
        message: "This is a test message with enough content.",
      })
    ).rejects.toBeDefined();
  });

  it("rejects inquiry with short message", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submitInquiry({
        name: "John Doe",
        email: "john@example.com",
        subject: "Test",
        message: "Short",
      })
    ).rejects.toBeDefined();
  });
});

describe("admin.listInquiries", () => {
  it("allows admin to retrieve inquiries", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.listInquiries();
    expect(Array.isArray(result)).toBe(true);
  });

  it("denies non-admin access to inquiries", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.listInquiries()).rejects.toBeDefined();
  });
});
