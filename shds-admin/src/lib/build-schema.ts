import { z } from "zod";
import type { FieldConfig } from "@/types/resource-config";

/**
 * Builds a Zod object schema from a module's FieldConfig[]. This is what
 * gives every generic CRUD form real validation without writing a
 * hand-rolled schema per module.
 */
export function buildZodSchema(fields: FieldConfig[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    if (field.schema) {
      shape[field.name] = field.schema;
      continue;
    }

    let schema: z.ZodTypeAny;

    switch (field.type) {
      case "number":
        schema = field.required
          ? z.coerce.number().refine((v) => !Number.isNaN(v), {
              message: `${field.label} is required.`,
            })
          : z.coerce.number().optional().nullable();
        break;
      case "email":
        schema = z.string().email(`Enter a valid email address.`);
        if (!field.required) schema = schema.optional().or(z.literal(""));
        break;
      case "url":
        schema = z.string().url("Enter a valid URL.");
        if (!field.required) schema = schema.optional().or(z.literal(""));
        break;
      case "boolean":
        schema = z.boolean().default(false);
        break;
      case "date":
        schema = field.required
          ? z.string().min(1, `${field.label} is required.`)
          : z.string().optional().or(z.literal(""));
        break;
      default:
        schema = field.required
          ? z.string().min(1, `${field.label} is required.`)
          : z.string().optional().or(z.literal(""));
    }

    shape[field.name] = schema;
  }

  return z.object(shape);
}
