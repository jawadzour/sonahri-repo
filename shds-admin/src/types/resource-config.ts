import type { ReactNode } from "react";
import type { ZodType } from "zod";

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "email"
  | "password"
  | "select"
  | "combobox"
  | "boolean"
  | "date"
  | "image"
  | "file"
  | "url";

export interface SelectOption {
  label: string;
  value: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  description?: string;
  /** Grid width out of a 2-column form layout. Defaults to 1. */
  colSpan?: 1 | 2;
  /** Zod schema override for this field; otherwise inferred from type/required. */
  schema?: ZodType;
  /** For type "combobox": loads the distinct existing values to pick from. */
  loadOptions?: () => Promise<string[]>;
}

export interface ColumnConfig<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

export interface ResourceConfig<T extends { id: number | string }> {
  /** Unique slug, also used as the React Query-ish cache key. */
  key: string;
  label: string;
  singularLabel: string;
  description?: string;
  /** REST endpoint path, e.g. "/programs" */
  endpoint: string;
  columns: ColumnConfig<T>[];
  fields: FieldConfig[];
  searchPlaceholder?: string;
  pageSize?: number;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}
